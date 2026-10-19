import type { Map as MapboxMap } from "mapbox-gl";
import usePointStore from "../zustand/usePointStore";

// The country map currently on screen, if any. Kept apart from markers.ts so components that are also
// server-rendered (the school page's details) can use it without importing mapbox-gl.
let activeMap: MapboxMap | null = null;

export function setActiveMap(map: MapboxMap | null) {
    activeMap = map;
}

export function getActiveMap() {
    return activeMap;
}

// Closes the school's details and flies the live map to one of its campuses. The school stays selected,
// so its pins stay lit. Returns false when no map is on screen.
export function showOnMap(coordinates: [number, number]) {
    if (!activeMap) return false;
    usePointStore.getState().setIsOpen(false);
    activeMap.flyTo({ center: coordinates, zoom: Math.max(activeMap.getZoom(), 15), essential: true });
    return true;
}
