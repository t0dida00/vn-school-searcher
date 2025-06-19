"use client";
import dynamic from "next/dynamic";
import useDataStore from "../zustand/useDataStore";
import { useEffect } from "react";
const Map = dynamic(() => import("../components/Map"), { ssr: false, loading: () => <div className="w-full min-h-screen flex justify-center items-center">Đang tải bản đồ...</div>, });

interface MapClientWrapperProps {
    data: any[];
    error: string | null;
}

export default function MapClientWrapper({ data, error }: MapClientWrapperProps) {
    const setData = useDataStore((state) => state.setData);
    const setError = useDataStore((state) => state.setError);

    useEffect(() => {
        if (data) {
            setData(data);
        }
    }, [data, setData]);
    useEffect(() => {
        setError(error);
    }, [error, setError]);

    return <Map />;
}
