import { useCallback } from "react";
import useStore from "../zustand/usePointStore";

export function useZoomToPoint(map: mapboxgl.Map | null) {
  return useCallback((point: GeoJSON.Feature) => {
    if (!map) return;
    const setSelectedPoint  = useStore.getState().setSelectedPoint;
      const setIsOpen  = useStore.getState().setIsOpen;
    if (point.geometry.type === "Point") {
       if (setSelectedPoint && setIsOpen) {
         setSelectedPoint(point);
           setIsOpen(true);
       }
      const coords = point.geometry.coordinates as [number, number];
      map.flyTo({
        center: coords,
        zoom: 15,
        essential: true,
      });
    }
  }, [map]);
}
