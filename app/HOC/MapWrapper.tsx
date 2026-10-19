"use client";
import dynamic from "next/dynamic";
import useDataStore from "../zustand/useDataStore";
import { useEffect } from "react";
import MapLoading from "../components/MapLoading";
import type { CountryCode } from "../lib/countries";
const Map = dynamic(() => import("../components/Map"), { ssr: false, loading: () => <MapLoading /> });

interface MapClientWrapperProps {
    data: any[];
    error: string | null;
    country: CountryCode;
}

export default function MapClientWrapper({ data, error, country }: MapClientWrapperProps) {
    const setData = useDataStore((state) => state.setData);
    const setError = useDataStore((state) => state.setError);

    useEffect(() => {
        if (data) {
            setData(data, country);
        }
    }, [data, country, setData]);
    useEffect(() => {
        setError(error);
    }, [error, setError]);

    return <Map />;
}
