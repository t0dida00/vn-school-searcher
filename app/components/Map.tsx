// components/Map.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { INITIAL_VIEWPORT, MAP_STYLE, MAPBOX_ACCESS_TOKEN } from "../map/mapboxConfig";
import { addCountryHighlightLayer, addUniversityLayers } from "../map/layerConfig";
import { addMapEventListeners } from "../map/events";
import useDataStore from "../zustand/useDataStore";
import SchoolList from "./SchoolList";
import Search from "./Search";
import styles from "./styles/map.module.scss";
import MobileList from "./MobileList";
import SchoolDrawer from "./SchoolDetails/SchoolDrawer";
import SchoolDetailDialog from "./SchoolDetails/SchoolDetailDialog";
import { Notebook } from "lucide-react";
import CustomTooltip from "./Tooltip";
import { useRouter } from "next/navigation";
import CustomFunnel from "./Funnel";
import useStore from "../zustand/usePointStore";
import SchoolLogo from "./Avatar";
import { useZoomToPoint } from "../hooks/useZoomToPoint";
export default function Map() {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [query, setQuery] = useState("");
    const { data, filteredData } = useDataStore();
    const { points } = useStore();
    const router = useRouter()
    const [searchFocus, setSearchFocus] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const zoomToPoint = useZoomToPoint(map);
    console.log(filteredData.length, "filteredData length");
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
    }, [map, data]);

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
        <div ref={mapContainerRef} style={{ width: "100%", height: "100dvh", position: "relative" }}>
            <div className={styles.left_container}>
                <div className={styles.search_container}>
                    <Search onFocus={() => setSearchFocus(true)} query={query} setQuery={setQuery} />
                    <SchoolDetailDialog />
                    <SchoolList map={map} setQuery={setQuery} />
                </div>



            </div>
            <div ref={wrapperRef} className={styles.mobile_left_container}>
                <Search onFocus={() => setSearchFocus(true)} query={query} setQuery={setQuery} />
                {searchFocus && <MobileList map={map} setQuery={setQuery} setSearchFocus={setSearchFocus} />}
                <SchoolDrawer />
                <div className="absolute flex flex-row overflow-auto gap-[10px] translate-y-3 left-0 w-full ">
                    {filteredData.length == 0 && points.map((point, index) => {
                        const { properties } = point;
                        const { logo, name } = properties || {};

                        return (
                            <div key={index} onClick={() => zoomToPoint(point)} >
                                <SchoolLogo src={logo} alt={name || `School ${index + 1}`} customStyle={{ height: '45px', width: "45px" }} />

                            </div>
                        );
                    })}


                </div>

            </div>
            <button className="fixed bottom-24 right-4 bg-gray-800 hover:bg-gray-700 text-white p-1 rounded-full shadow-lg transition z-50 cursor-pointer" onClick={() => router.push("/school-list")} >
                <CustomTooltip
                    name={<Notebook size={30} className="w-6 h-6" />}
                    title="Danh sách trường học"
                />

            </button>
            <CustomFunnel />

        </div>
    );
}
