// components/Map.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { INITIAL_VIEWPORT, MAP_STYLE, MAPBOX_ACCESS_TOKEN } from "../map/mapboxConfig";
import { addCountryHighlightLayer, addUniversityLayers } from "../map/layerConfig";
import { addMapEventListeners } from "../map/events";
import UniversityDetail from "./SchoolDetails/UniversityDetail";
import useDataStore from "../zustand/useDataStore";
import SchoolList from "./SchoolList";
import Search from "./Search";
import styles from "./styles/map.module.scss";
import useStore from "../zustand/usePointStore";
import HighSchoolDetail from "./SchoolDetails/HighSchoolDetail";
import MobileList from "./MobileList";
import UniversityDrawer from "./SchoolDetails/UniversityDrawer";
import HighSchoolDrawer from "./SchoolDetails/HighSchoolDrawer";
import SchoolDrawer from "./SchoolDetails/SchoolDrawer";
import SchoolDetailDialog from "./SchoolDetails/SchoolDetailDialog";
export default function Map() {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [query, setQuery] = useState("");
    const { data } = useDataStore();
    const { selectedPoint, setSelectedPoint } = useStore();
    const [searchFocus, setSearchFocus] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!map && mapContainerRef.current) {
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            const newMap = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: MAP_STYLE,
                center: INITIAL_VIEWPORT.center,
                zoom: INITIAL_VIEWPORT.zoom,
                maxZoom: INITIAL_VIEWPORT.maxZoom,
                minZoom: INITIAL_VIEWPORT.minZoom,
            });

            newMap.on("load", () => {
                addCountryHighlightLayer(newMap);
                addUniversityLayers(newMap, {
                    type: "FeatureCollection",
                    features: Array.isArray(data) ? data : [],
                });
                addMapEventListeners(newMap);
            });
            newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
            setMap(newMap);
        }
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [map]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (window.innerWidth >= 576) return;
            const target = event.target as Node;
            const clickedOutsideWrapper =
                wrapperRef.current && !wrapperRef.current.contains(target);
            if (clickedOutsideWrapper) {
                setSearchFocus(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={mapContainerRef} style={{ width: "100%", height: "100vh", position: "relative" }}>
            <div className={styles.left_container}>
                <Search onFocus={() => setSearchFocus(true)} query={query} setQuery={setQuery} />
                {/* {renderDetailComponent(selectedPoint)} */}
                <SchoolDetailDialog />
                <SchoolList map={map} setQuery={setQuery} />

            </div>
            <div ref={wrapperRef} className={styles.mobile_left_container}>
                <Search onFocus={() => setSearchFocus(true)} query={query} setQuery={setQuery} />
                {searchFocus && <MobileList map={map} setQuery={setQuery} setSearchFocus={setSearchFocus} />}
                {/* {renderMobileDetailComponent(selectedPoint)} */}
                <SchoolDrawer />
                {/* <HighSchoolDrawer /> */}
            </div>
        </div>
    );
}
