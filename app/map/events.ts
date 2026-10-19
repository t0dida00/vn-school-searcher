import { Map, MapMouseEvent } from "mapbox-gl";
import useStore from "../zustand/usePointStore";
import useMapDataStore from "../zustand/useMapDataStore";
import { applyMarkerState, syncSchoolMarkers } from "./markers";
import { parentIdOf } from "../utils/campuses";
import { schoolId } from "../utils/schoolId";

export function updateVisiblePoints(map: Map) {
  const setPoints = useStore.getState().setPoints;
     const source = map.getSource("universities") as mapboxgl.GeoJSONSource;
    if (!source || !(source as any)._data) {
      return;
    }
    const bounds = map.getBounds();
    const allFeatures = (source as any)._data.features as GeoJSON.Feature[];
    const { data } = useMapDataStore.getState();
    // One entry per school, even with several of its campuses in view; campus pins map back to the school
    const seen = new Set<string>();
    const visiblePoints: GeoJSON.Feature[] = [];
    for (const feature of allFeatures) {
      if (feature.geometry.type !== "Point") continue;
      const [lng, lat] = feature.geometry.coordinates;
      if (!bounds || !bounds.contains([lng, lat])) continue;
      const parentId = parentIdOf(feature);
      if (seen.has(parentId)) continue;
      seen.add(parentId);
      visiblePoints.push(data.find((d) => schoolId(d) === parentId) ?? feature);
    }
    setPoints(visiblePoints);

  }

export function addMapEventListeners(map: Map) {
 const handleVisiblePoints = () => updateVisiblePoints(map);
   const tryRunWhenReady = () => {
    if (map.isStyleLoaded() && map.getSource("universities")) {
      handleVisiblePoints();
    } else {
      // Retry shortly after if style or source isn't ready
      setTimeout(tryRunWhenReady, 200);
    }
  };
  tryRunWhenReady();
   map.on("load", handleVisiblePoints);
  // Run again when map stops moving or zooming
  map.on("moveend", handleVisiblePoints);
  map.on("zoomend", handleVisiblePoints);
  // Keep logo markers in step with clustering; cheap no-op until the source has loaded
  map.on("render", () => syncSchoolMarkers(map));
  const unsubscribe = useStore.subscribe(() => applyMarkerState(map));
  map.on("remove", unsubscribe);
  map.on("click", "clusters", (e: MapMouseEvent & { features?: any[] }) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
    const clusterId = features[0].properties?.cluster_id;
    (map.getSource("universities") as any).getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
      if (err) return;
      map.easeTo({
        center: (features[0].geometry as any).coordinates,
        zoom,
      });
    });
  });

  ["clusters"].forEach(layer => {
    map.on("mouseenter", layer, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", layer, () => {
      map.getCanvas().style.cursor = "";
    });
  });
 
}
