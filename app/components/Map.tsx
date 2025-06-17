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
export default function Map() {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const { data } = useDataStore();
    const { selectedPoint } = useStore();

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
    const renderDetailComponent = (point: any) => {
        if (!point || !point.properties?.type) return null;

        switch (point.properties.type) {
            case "university":
                return <UniversityDetail />;
            case "highschool":
                return <HighSchoolDetail />;
            case "secondary":
                return null;
            default:
                return null;
        }
    };
    return (
        <div ref={mapContainerRef} style={{ width: "100%", height: "100vh", position: "relative" }}>
            <div className={styles.left_container}>
                <Search />
                {renderDetailComponent(selectedPoint)}
                <SchoolList map={map} />
            </div>
            <div className={styles.mobile_left_container}>
                <Search />

            </div>
        </div>
    );
}
