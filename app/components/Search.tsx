"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import useDataStore from "../zustand/useDataStore";

interface SearchProps {
    placeholder?: string;
    onFocus?: () => void;
    query?: string;
    setQuery?: (val: string) => void;
}

export default function Search({ placeholder = "Search...", onFocus, query = "", setQuery }: SearchProps) {
    const { data, setFilteredData } = useDataStore();
    // Handle search logic here
    React.useEffect(() => {
        const handler = setTimeout(() => {
            if (query.trim() === "") {
                setFilteredData([])
                return;
            }
            const lowerQuery = query.toLowerCase();
            const filtered = data.filter((item: any) => {

                const { name, code, address, city } = item.properties || {};
                return (
                    name?.toLowerCase().includes(lowerQuery) ||
                    code?.toLowerCase().includes(lowerQuery) ||
                    address?.toLowerCase().includes(lowerQuery) ||
                    city?.toLowerCase().includes(lowerQuery)
                );
            });
            setFilteredData(filtered); // Update the store with filtered results
        }, 500);
        return () => clearTimeout(handler); // cleanup on query/data change
    }, [query, data, setFilteredData]);
    return (
        <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onFocus={onFocus}
            onChange={(e) => setQuery?.(e.target.value)}
            className="flex-1"
        />
    );
}
