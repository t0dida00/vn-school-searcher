// components/Map.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import Link from "next/link";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import MapLoading, { loaderTimeLeft, resetLoaderClock } from "./MapLoading";

// Reveal anyway if the first full render never settles (e.g. a tile keeps failing)
const READY_FALLBACK_MS = 10000;

export default function Map() {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    // Hidden until the Finland mask is drawn: before that Mapbox shows the plain world basemap
    const [mapReady, setMapReady] = useState(false);
    // A fast map still waits for the loader's sequence to finish, so it doesn't flash and cut off
    const [loaderDone, setLoaderDone] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setLoaderDone(true), loaderTimeLeft());
        return () => clearTimeout(t);
    }, []);
    const ready = mapReady && loaderDone;
    // Keep the loader mounted while it fades out over the revealed map
    const [loaderGone, setLoaderGone] = useState(false);
    useEffect(() => {
        if (!ready) return;
        const t = setTimeout(() => {
            setLoaderGone(true);
            resetLoaderClock();
        }, 500);
        return () => clearTimeout(t);
    }, [ready]);
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
                // First idle after the custom layers exist = the custom map is fully rendered
                newMap.once("idle", () => setMapReady(true));
            });
            const fallback = setTimeout(() => setMapReady(true), READY_FALLBACK_MS);
            newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
            setMap(newMap);
            return () => {
                clearTimeout(fallback);
                newMap.remove();
            };
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
            {/* Fade a wrapper, not the container: re-rendering the container's className would wipe the
                classes Mapbox adds to it (mapboxgl-map etc.) */}
            <div className={cn("size-full transition-opacity duration-300", ready ? "opacity-100" : "opacity-0")}>
                <div ref={mapContainerRef} className="size-full" />
            </div>
            {!loaderGone && (
                <div className={cn("transition-opacity duration-500", ready && "pointer-events-none opacity-0")}>
                    <MapLoading />
                </div>
            )}
            {ready && (
                <>
                    <MapSearch map={map} />
                    {/* Mirrors the "Map view" button on /school-list; bottom-right sits over empty sea/Russia */}
                    <Button asChild className="absolute bottom-10 right-3 z-10 rounded-full shadow-lg">
                        <Link href="/school-list">
                            <List />
                            List view
                        </Link>
                    </Button>
                </>
            )}
            <SchoolDetailDialog />
            <SchoolDrawer />
        </div>
    );
}
