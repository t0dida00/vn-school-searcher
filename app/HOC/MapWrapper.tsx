"use client";
import dynamic from "next/dynamic";
import useDataStore from "../zustand/useDataStore";
import { useEffect } from "react";
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function MapClientWrapper({ data }: { data: any[] }) {
    const setData = useDataStore((state) => state.setData);

    useEffect(() => {
        setData(data);
    }, [data, setData]);
    return <Map />;
}
