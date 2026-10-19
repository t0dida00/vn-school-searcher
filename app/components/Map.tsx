// components/Map.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import Link from "next/link";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";
import "mapbox-gl/dist/mapbox-gl.css";
import { FINLAND_BOUNDS, INITIAL_VIEWPORT, MAP_STYLE, MAPBOX_ACCESS_TOKEN } from "../map/mapboxConfig";
import { keepFinlandLocked, lockToFinland } from "../map/viewport";
import { addFinlandLayers, addUniversityLayers } from "../map/layerConfig";
import { addMapEventListeners, updateVisiblePoints } from "../map/events";
import { schoolId, selectSchool } from "../map/markers";
import useDataStore from "../zustand/useDataStore";
import SchoolDrawer from "./SchoolDetails/SchoolDrawer";
import SchoolDetailDialog from "./SchoolDetails/SchoolDetailDialog";
import MapSearch from "./MapSearch";
export default function Map() {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const { data, filteredData } = useDataStore();
    useEffect(() => {
        if (!map && mapContainerRef.current) {
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            const newMap = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: MAP_STYLE,
                bounds: FINLAND_BOUNDS,
                renderWorldCopies: false,
                // Flat map: the Finland silhouette would bend on Mapbox's default globe at low zoom
                projection: "mercator",
                maxZoom: INITIAL_VIEWPORT.maxZoom,
                minZoom: INITIAL_VIEWPORT.minZoom,
            });

            newMap.on("load", () => {
                // The container can change size between construction and load, so fit here, not via `bounds`
                lockToFinland(newMap);
                keepFinlandLocked(newMap);
                addFinlandLayers(newMap);
                // Read from the store, not the closure: data may have arrived after this effect ran
                const { data: latest, filteredData: latestFiltered } = useDataStore.getState();
                addUniversityLayers(newMap, {
                    type: "FeatureCollection",
                    features: latestFiltered ?? (Array.isArray(latest) ? latest : []),
                } as GeoJSON.FeatureCollection);
                addMapEventListeners(newMap);
                // Deep link from /school/[id] ("View on map")
                const linked = new URLSearchParams(window.location.search).get("school");
                const school = linked && Array.isArray(latest) && latest.find((d) => schoolId(d) === linked);
                if (school) selectSchool(newMap, school);
            });
            newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
            setMap(newMap);
            return () => newMap.remove();
        }
    }, []);
    useEffect(() => {
        if (map && map.getSource("universities")) {
            const geojson: GeoJSON.FeatureCollection = {
                type: "FeatureCollection",
                features: filteredData ? filteredData : Array.isArray(data) ? data : [],
            };

            // 👇 Just update the existing source's data
            (map.getSource("universities") as mapboxgl.GeoJSONSource).setData(geojson);
            updateVisiblePoints(map);
        }
    }, [filteredData, data, map]);
    return (
        <div className="relative size-full">
            {/* Mapbox wants its container empty, so the overlays are siblings, not children */}
            <div ref={mapContainerRef} className="size-full" />
            <MapSearch map={map} />
            {/* Mirrors the "Map view" button on /school-list; bottom-right sits over empty sea/Russia */}
            <Button asChild className="absolute bottom-10 right-3 z-10 rounded-full shadow-lg">
                <Link href="/school-list">
                    <List />
                    List view
                </Link>
            </Button>
            <SchoolDetailDialog />
            <SchoolDrawer />
        </div>
    );
}
