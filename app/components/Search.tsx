"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import useDataStore from "../zustand/useDataStore";
import { cn } from "@/lib/utils";

interface SearchProps {
    placeholder?: string;
    onFocus?: () => void;
    query?: string;
    setQuery?: (val: string) => void;
}

export default function Search({
    placeholder = "Search...",
    onFocus,
    query = "",
    setQuery,
}: SearchProps) {
    const { data, setFilteredData } = useDataStore();

    React.useEffect(() => {
        const handler = setTimeout(() => {
            if (query.trim() === "") {
                setFilteredData([]);
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
            setFilteredData(filtered);
        }, 500);
        return () => clearTimeout(handler);
    }, [query, data, setFilteredData]);

    return (
        <div className="relative w-full max-w-xl rounded-full z-10">
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                    type="search"
                    placeholder={placeholder}
                    value={query}
                    onFocus={onFocus}
                    onChange={(e) => setQuery?.(e.target.value)}
                    className={cn(
                        "pl-12 pr-4 py-4",
                        "!text-[16px]",
                        "rounded-full bg-white text-sm",
                        "shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
                        "border-none outline-none",
                        "focus:ring-0 focus-visible:ring-0"
                    )}
                />
            </div>
        </div>
    );
}
