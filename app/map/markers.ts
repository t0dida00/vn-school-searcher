import mapboxgl, { type Map as MapboxMap } from "mapbox-gl";
import useDataStore from "../zustand/useDataStore";
import usePointStore from "../zustand/usePointStore";
import styles from "./markers.module.scss";
import { schoolId } from "../utils/schoolId";

// Mapbox circle layers can't render remote logos, so unclustered schools are drawn
// as HTML markers that follow the clustered "universities" source.
const markersByMap = new WeakMap<MapboxMap, Map<string, mapboxgl.Marker>>();

function getMarkers(map: MapboxMap) {
    let markers = markersByMap.get(map);
    if (!markers) {
        markers = new Map();
        markersByMap.set(map, markers);
    }
    return markers;
}

export { schoolId };

export function selectSchool(map: MapboxMap | null, school: any) {
    const { setSelectedPoint, setIsOpen } = usePointStore.getState();
    setSelectedPoint(school);
    setIsOpen(true);
    if (map && school?.geometry?.type === "Point") {
        map.flyTo({
            center: school.geometry.coordinates,
            zoom: Math.max(map.getZoom(), 12),
            essential: true,
        });
    }
}

function createMarkerElement(map: MapboxMap, school: any) {
    const { name, code, logo } = school.properties || {};
    const el = document.createElement("button");
    el.type = "button";
    el.className = styles.marker;
    el.setAttribute("aria-label", name ?? code ?? "School");

    const label = document.createElement("span");
    label.className = styles.label;
    label.textContent = name ?? "";

    const badge = document.createElement("span");
    badge.className = styles.badge;
    const fallback = () => {
        badge.replaceChildren();
        const text = document.createElement("span");
        text.className = styles.fallback;
        text.textContent = (code ?? name ?? "?").slice(0, 4).toUpperCase();
        badge.appendChild(text);
    };
    if (logo) {
        const img = document.createElement("img");
        img.src = logo;
        img.alt = "";
        img.loading = "lazy";
        img.onerror = fallback;
        badge.appendChild(img);
    } else {
        fallback();
    }

    const tip = document.createElement("span");
    tip.className = styles.tip;

    el.append(label, badge, tip);
    el.addEventListener("click", (e) => {
        e.stopPropagation();
        selectSchool(map, school);
    });
    return el;
}

export function syncSchoolMarkers(map: MapboxMap) {
    if (!map.getSource("universities") || !map.isSourceLoaded("universities")) return;

    const markers = getMarkers(map);
    const { data } = useDataStore.getState();
    const features = map.querySourceFeatures("universities", {
        filter: ["!", ["has", "point_count"]],
    });

    const visible = new Set<string>();
    for (const feature of features) {
        const id = feature.properties?.id;
        if (!id || visible.has(id)) continue;
        visible.add(id);
        if (markers.has(id)) continue;

        // Prefer the original document: querySourceFeatures stringifies nested properties
        const school = data.find((d) => schoolId(d) === id) ?? feature;
        const marker = new mapboxgl.Marker({ element: createMarkerElement(map, school), anchor: "bottom" })
            .setLngLat((school.geometry as GeoJSON.Point).coordinates as [number, number])
            .addTo(map);
        markers.set(id, marker);
    }

    for (const [id, marker] of markers) {
        if (!visible.has(id)) {
            marker.remove();
            markers.delete(id);
        }
    }
    applyMarkerState(map);
}

let highlightedId: string | null = null;

export function highlightSchool(map: MapboxMap | null, id: string | null) {
    highlightedId = id;
    if (map) applyMarkerState(map);
}

export function applyMarkerState(map: MapboxMap) {
    const selectedId = schoolId(usePointStore.getState().selectedPoint);
    for (const [id, marker] of getMarkers(map)) {
        const el = marker.getElement();
        el.classList.toggle(styles.selected, id === selectedId);
        el.classList.toggle(styles.highlighted, id === highlightedId);
    }
}
