import { Map, MapMouseEvent } from "mapbox-gl";
import useStore from "../zustand/usePointStore";
import { applyMarkerState, syncSchoolMarkers } from "./markers";

export function updateVisiblePoints(map: Map) {
  const setPoints = useStore.getState().setPoints;
     const source = map.getSource("universities") as mapboxgl.GeoJSONSource;
    if (!source || !(source as any)._data) {
      return;
    }
    const bounds = map.getBounds();
    const allFeatures = (source as any)._data.features as GeoJSON.Feature[];
    const visiblePoints = allFeatures.filter((feature) => {
      if (feature.geometry.type !== "Point") return false;
      const [lng, lat] = feature.geometry.coordinates;
      return bounds && bounds.contains([lng, lat]);
    });
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
