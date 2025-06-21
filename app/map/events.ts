import { Map, MapMouseEvent } from "mapbox-gl";
import useStore from "../zustand/usePointStore";

export function addMapEventListeners(map: Map) {
 const handleVisiblePoints = () => {
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
    }).slice(0, 20);;
    setPoints(visiblePoints);

  };
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

  map.on("click", "unclustered-point", (e: MapMouseEvent & { features?: any[] }) => {
      const feature = e.features?.[0];
      const setSelectedPoint = useStore.getState().setSelectedPoint;
      const setIsOpen  = useStore.getState().setIsOpen;
      if (!feature) return;
  //     const isDesktop = window.innerWidth >= 576;
  //      if (setSelectedPoint) setSelectedPoint(feature);
  // if (isDesktop && setIsOpen) setIsOpen(true); // Only open dialog on desktop
      if (setSelectedPoint && setIsOpen) {
        setSelectedPoint(feature);
          setIsOpen(true);
      }
      const coordinates = (feature.geometry as any).coordinates as [number, number];

      map.flyTo({
        center: coordinates,
        zoom: 15, // Adjust zoom level as needed
        essential: true,
      });
    });
  ["clusters", "unclustered-point"].forEach(layer => {
    map.on("mouseenter", layer, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", layer, () => {
      map.getCanvas().style.cursor = "";
    });
  });
 
}
