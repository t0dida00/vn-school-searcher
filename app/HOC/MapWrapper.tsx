"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import useMapDataStore from "../zustand/useMapDataStore";
import MapLoading from "../components/MapLoading";
import type { CountryCode } from "../lib/countries";
const Map = dynamic(() => import("../components/Map"), { ssr: false, loading: () => <MapLoading /> });

// Loads the country's slim school GeoJSON (bundled, no API call) while mapbox-gl downloads
export default function MapClientWrapper({ country }: { country: CountryCode }) {
    const load = useMapDataStore((state) => state.load);

    useEffect(() => {
        load(country);
    }, [country, load]);

    return <Map />;
}
