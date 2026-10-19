import mapboxgl, { type Map as MapboxMap } from "mapbox-gl";
import useMapDataStore from "../zustand/useMapDataStore";
import usePointStore from "../zustand/usePointStore";
import styles from "./markers.module.scss";
import { schoolId } from "../utils/schoolId";
import { campusesOf, campusView, parentIdOf } from "../utils/campuses";

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

// `at` flies to a specific campus instead of the school's main location
export function selectSchool(map: MapboxMap | null, school: any, at?: [number, number]) {
    const { setSelectedPoint, setIsOpen } = usePointStore.getState();
    setSelectedPoint(school);
    setIsOpen(true);
    const center = at ?? (school?.geometry?.type === "Point" ? school.geometry.coordinates : null);
    if (map && center) {
        map.flyTo({
            center,
            zoom: Math.max(map.getZoom(), 12),
            essential: true,
        });
    }
}

export type MarkerCampus = { name: string; coordinates: [number, number] };

// The school's logo pin, shared by the country maps and the globe. `campus` makes a smaller pin for one of
// the school's extra campuses.
export function createLogoMarkerElement(school: any, campus: MarkerCampus | undefined, onClick: () => void) {
    const { name, code, logo } = school.properties || {};
    const title = campus ? `${name} · ${campus.name}` : name;
    const el = document.createElement("button");
    el.type = "button";
    el.className = campus ? `${styles.marker} ${styles.campus}` : styles.marker;
    el.setAttribute("aria-label", title ?? code ?? "School");

    const label = document.createElement("span");
    label.className = styles.label;
    label.textContent = title ?? "";

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
        onClick();
    });
    return el;
}

// On a country map, clicking a pin opens the school; a campus pin opens it as seen from that campus
// (campus name under the title, the campus's city and address)
function createMarkerElement(map: MapboxMap, school: any, campus?: MarkerCampus) {
    const full = campus && campusesOf(school).find((c) => c.name === campus.name);
    return createLogoMarkerElement(school, campus, () =>
        selectSchool(map, full ? campusView(school, full) : school, campus?.coordinates)
    );
}

export function syncSchoolMarkers(map: MapboxMap) {
    if (!map.getSource("universities") || !map.isSourceLoaded("universities")) return;

    const markers = getMarkers(map);
    const { data } = useMapDataStore.getState();
    const features = map.querySourceFeatures("universities", {
        filter: ["!", ["has", "point_count"]],
    });

    const visible = new Set<string>();
    for (const feature of features) {
        const id = feature.properties?.id;
        if (!id || visible.has(id)) continue;
        visible.add(id);
        if (markers.has(id)) continue;

        // Prefer the original document: querySourceFeatures stringifies nested properties. Campus pins
        // ("<school>~<campus>") render their school at the campus location.
        const parentId = parentIdOf(id);
        const school = data.find((d) => schoolId(d) === parentId) ?? feature;
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        const campus = parentId !== id ? { name: String(feature.properties?.campus ?? ""), coordinates } : undefined;
        const marker = new mapboxgl.Marker({ element: createMarkerElement(map, school, campus), anchor: "bottom" })
            .setLngLat(campus ? coordinates : ((school.geometry as GeoJSON.Point).coordinates as [number, number]))
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
        // A school's campus pins light up with its main pin
        const parentId = parentIdOf(id);
        el.classList.toggle(styles.selected, parentId === selectedId);
        el.classList.toggle(styles.highlighted, parentId === highlightedId);
    }
}
