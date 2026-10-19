"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type mapboxgl from "mapbox-gl";
import { ChevronDown, Loader2, MapPin, Search, SearchX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useMapDataStore from "../zustand/useMapDataStore";
import usePointStore from "../zustand/usePointStore";
import { EMPTY_FILTERS, matchSchool } from "../utils/matchSchool";
import { highlightSchool, schoolId, selectSchool } from "../map/markers";
import RankTag from "./RankTag";

const TYPE_OPTIONS = [
    { label: "All", value: "all" },
    { label: "University", value: "University" },
    { label: "UAS", value: "University of Applied Sciences" },
];

function ResultLogo({ src, code }: { src?: string; code?: string }) {
    const [failed, setFailed] = useState(false);
    return (
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
            {src && !failed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" loading="lazy" className="size-4/5 object-contain" onError={() => setFailed(true)} />
            ) : (
                <span className="text-[10px] font-bold">{(code ?? "?").slice(0, 4).toUpperCase()}</span>
            )}
        </span>
    );
}

export default function MapSearch({ map }: { map: mapboxgl.Map | null }) {
    const { data, loading, error, setFilteredData } = useMapDataStore();
    const { points, selectedPoint } = usePointStore();
    const [query, setQuery] = useState("");
    const [type, setType] = useState("all");
    // Only the types in this country's data; no pills at all when every school has the same type (Vietnam)
    const typeOptions = useMemo(() => {
        const types = new Set(data.map((d) => d.properties?.type));
        const options = TYPE_OPTIONS.filter((opt) => opt.value === "all" || types.has(opt.value));
        return options.length > 2 ? options : [];
    }, [data]);
    const [activeIndex, setActiveIndex] = useState(-1);
    // Open by default on desktop; on phones (and short landscape phones, where it would cover the map)
    // the list only opens while searching
    const [expanded, setExpanded] = useState(
        () => typeof window !== "undefined" && window.innerWidth >= 576 && window.innerHeight >= 600
    );
    const panelRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const isFiltering = query.trim() !== "" || type !== "all";
    const results = useMemo(
        () => (isFiltering ? data.filter((d) => matchSchool(d, { ...EMPTY_FILTERS, query, type })) : null),
        [data, query, type, isFiltering]
    );
    // With no search the list mirrors the schools currently in view
    const items: any[] = results ?? points;

    // Filter the pins too, then frame what matched
    useEffect(() => {
        setFilteredData(results);
        setActiveIndex(-1);
        if (!map || !results?.length) return;
        const handle = setTimeout(() => {
            // Keep matches clear of the floating panel: beside it on desktop, below it on phones
            const panel = panelRef.current?.getBoundingClientRect();
            const isDesktop = window.innerWidth >= 576;
            const padding = isDesktop
                ? { top: 60, bottom: 60, left: (panel?.width ?? 360) + 40, right: 60 }
                : { top: Math.min((panel?.height ?? 120) + 40, map.getContainer().clientHeight * 0.6), bottom: 40, left: 40, right: 40 };
            if (results.length === 1) {
                map.flyTo({
                    center: results[0].geometry.coordinates,
                    zoom: Math.max(map.getZoom(), 10),
                    offset: isDesktop ? [(padding.left - padding.right) / 2, 0] : [0, (padding.top - padding.bottom) / 2],
                    essential: true,
                });
                return;
            }
            const lngs = results.map((r) => r.geometry.coordinates[0]);
            const lats = results.map((r) => r.geometry.coordinates[1]);
            map.fitBounds(
                [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                {
                    padding,
                    maxZoom: 11,
                    duration: 800,
                }
            );
        }, 400);
        return () => clearTimeout(handle);
    }, [results, map, setFilteredData]);

    // Leaving the map shouldn't leave a filter behind for the next visit
    useEffect(() => () => setFilteredData(null), [setFilteredData]);

    useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            if (window.innerWidth >= 576) return;
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) setExpanded(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, []);

    useEffect(() => {
        listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    const choose = (school: any) => {
        selectSchool(map, school);
        highlightSchool(map, null);
        if (window.innerWidth < 576) {
            setExpanded(false);
            (document.activeElement as HTMLElement | null)?.blur();
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setExpanded(true);
            const next = e.key === "ArrowDown"
                ? Math.min(activeIndex + 1, items.length - 1)
                : Math.max(activeIndex - 1, 0);
            setActiveIndex(next);
            highlightSchool(map, schoolId(items[next]));
        } else if (e.key === "Enter") {
            const target = items[activeIndex] ?? (items.length === 1 ? items[0] : undefined);
            if (target) choose(target);
        } else if (e.key === "Escape") {
            if (query) setQuery("");
            else setExpanded(false);
        }
    };

    const selectedId = schoolId(selectedPoint);

    return (
        <div
            ref={panelRef}
            className="absolute inset-x-3 top-3 z-10 flex max-h-[calc(100%-1.5rem)] flex-col min-[576px]:inset-x-auto min-[576px]:left-4 min-[576px]:top-4 min-[576px]:w-[360px] min-[576px]:max-h-[calc(100%-2rem)]"
        >
            <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-background/95 shadow-lg backdrop-blur">
                <div className="relative p-2 pb-0">
                    <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground mt-1" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setExpanded(true);
                        }}
                        onFocus={() => setExpanded(true)}
                        onKeyDown={onKeyDown}
                        placeholder="School, city or field"
                        aria-label="Search schools"
                        role="combobox"
                        aria-expanded={expanded}
                        aria-controls="map-search-results"
                        aria-activedescendant={activeIndex >= 0 ? `map-result-${activeIndex}` : undefined}
                        className="h-11 w-full rounded-xl bg-muted/60 pl-10 pr-10 text-base outline-none transition-colors placeholder:text-muted-foreground focus:bg-muted"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-1 px-2 py-2" role="radiogroup" aria-label="School type">
                    {typeOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={type === opt.value}
                            onClick={() => setType(opt.value)}
                            className={cn(
                                "cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium transition-colors min-[360px]:px-3",
                                type === opt.value
                                    ? "border-foreground bg-foreground text-background"
                                    : "bg-background text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="ml-auto flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                        aria-expanded={expanded}
                        aria-controls="map-search-results"
                    >
                        {loading ? "Loading…" : (
                            <>
                                {items.length}
                                {/* Just the number on the narrowest phones so the type pills fit */}
                                <span className="max-[359px]:sr-only">
                                    {isFiltering ? (items.length === 1 ? " result" : " results") : " in view"}
                                </span>
                            </>
                        )}
                        <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
                    </button>
                </div>

                <div
                    className={cn(
                        "min-h-0 flex-col border-t",
                        expanded ? "flex" : "hidden"
                    )}
                >
                    {loading && (
                        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" /> Loading schools…
                        </div>
                    )}
                    {!loading && error && <p className="px-4 py-6 text-center text-sm text-destructive">Couldn&apos;t load schools.</p>}
                    {!loading && !error && items.length === 0 && (
                        <div className="flex flex-col items-center gap-1 px-4 py-8 text-center text-sm text-muted-foreground">
                            {isFiltering ? <SearchX className="mb-1 size-6" /> : <MapPin className="mb-1 size-6" />}
                            {isFiltering ? "No schools match your search." : "No schools in this area. Zoom out to see more."}
                        </div>
                    )}
                    {!loading && items.length > 0 && (
                        <ul
                            ref={listRef}
                            id="map-search-results"
                            role="listbox"
                            className="max-h-[45dvh] overflow-y-auto p-1.5 min-[576px]:max-h-none"
                            onMouseLeave={() => highlightSchool(map, null)}
                        >
                            {items.map((school, index) => {
                                const { name, city, code, logo, type: schoolType } = school.properties || {};
                                const id = schoolId(school);
                                return (
                                    <li key={id} id={`map-result-${index}`} data-index={index} role="option" aria-selected={index === activeIndex}>
                                        <button
                                            type="button"
                                            onClick={() => choose(school)}
                                            onMouseEnter={() => highlightSchool(map, id)}
                                            className={cn(
                                                "flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-muted",
                                                index === activeIndex && "bg-muted",
                                                id === selectedId && "bg-muted ring-1 ring-foreground/20"
                                            )}
                                        >
                                            <ResultLogo src={logo} code={code} />
                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="truncate text-sm font-medium">{name}</span>
                                                    <RankTag school={school} />
                                                </span>
                                                <span className="block truncate text-xs text-muted-foreground">
                                                    {city} · {schoolType === "University of Applied Sciences" ? "UAS" : schoolType}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
