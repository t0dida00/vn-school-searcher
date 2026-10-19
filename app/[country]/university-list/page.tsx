"use client";
import React, { Suspense, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUp, Heart, Map as MapIcon, RotateCcw, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { FilterCombobox } from "../../components/FilterCombobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useDataStore from "../../zustand/useDataStore";
import { EMPTY_FILTERS, matchSchool, type SchoolFilters as Filters } from "../../utils/matchSchool";
import { byRanking } from "../../utils/ranking";
import { schoolId } from "../../utils/schoolId";
import { useSavedIds } from "../../zustand/useSavedStore";
import SchoolCard, { SchoolCardSkeleton } from "./components/SchoolCard";
import SchoolDetailDialog from "../../components/SchoolDetails/SchoolDetailDialog";
import SchoolDrawer from "../../components/SchoolDetails/SchoolDrawer";
import SubFooter from "./components/SubFooter";
import QnA from "./components/QnA";
import Breaker from "./components/breaker";
import Hero from "./components/Hero";
import { useCountry, useCountryConfig, useCountryPath } from "../../utils/useCountry";

// Divisible by 2 and 3 so every page fills whole grid rows
const PAGE_SIZE = 12;
const GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

type Option = { label: string; value: string };

const EMPTY: any[] = [];

function UniversityList() {
    const searchParams = useSearchParams();
    const { data: storeData, country: dataCountry, fetchData, loading, error } = useDataStore();
    const country = useCountry();
    const { hasMap } = useCountryConfig();
    const path = useCountryPath();
    // Hide another country's schools while this country's load (e.g. right after switching countries)
    const data = dataCountry === country ? storeData : EMPTY;

    const [filters, setFilters] = useState<Filters>(() => ({
        query: searchParams.get("q") ?? "",
        city: searchParams.get("city") ?? "",
        field: searchParams.get("field") ?? "",
        type: searchParams.get("type") ?? "all",
    }));
    const [options, setOptions] = useState<{ cities: Option[]; fields: Option[]; systems: Option[] }>({
        cities: [],
        fields: [],
        systems: [],
    });
    const [savedOnly, setSavedOnly] = useState(() => searchParams.get("saved") === "1");
    const savedIds = useSavedIds();
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const update = (patch: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...patch }));
    const clearAll = () => {
        setFilters(EMPTY_FILTERS);
        setSavedOnly(false);
    };

    // Uses the cached schools when they're fresh and for this country; fetches otherwise
    useEffect(() => {
        fetchData(country);
    }, [country, fetchData]);

    useEffect(() => {
        fetch(`/filter-options/${country}.json`)
            .then((res) => res.json())
            .then(setOptions)
            .catch((err) => console.error("Failed to load filter options", err));
    }, [country]);

    // Keep filters in the URL so results can be shared and survive reloads
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.query.trim()) params.set("q", filters.query.trim());
        if (filters.city) params.set("city", filters.city);
        if (filters.field) params.set("field", filters.field);
        if (filters.type !== "all") params.set("type", filters.type);
        if (savedOnly) params.set("saved", "1");
        const qs = params.toString();
        window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
        setVisibleCount(PAGE_SIZE);
    }, [filters, savedOnly]);

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 600);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const deferredFilters = useDeferredValue(filters);
    const results = useMemo(
        () =>
            data
                .filter((item) => (!savedOnly || savedIds.includes(schoolId(item))) && matchSchool(item, deferredFilters))
                .sort(byRanking),
        [data, deferredFilters, savedOnly, savedIds]
    );
    const visibleItems = results.slice(0, visibleCount);

    const { ref, inView } = useInView({ rootMargin: "200px" });
    useEffect(() => {
        if (inView && visibleCount < results.length) {
            setVisibleCount((prev) => prev + PAGE_SIZE);
        }
    }, [inView, visibleCount, results.length]);

    const labelOf = (list: Option[], value: string) => list.find((o) => o.value === value)?.label ?? value;
    const activeChips = [
        filters.city && { key: "city", label: labelOf(options.cities, filters.city), clear: () => update({ city: "" }) },
        filters.field && { key: "field", label: labelOf(options.fields, filters.field), clear: () => update({ field: "" }) },
    ].filter(Boolean) as { key: string; label: string; clear: () => void }[];
    const activeFilterCount = activeChips.length + (filters.type !== "all" ? 1 : 0) + (savedOnly ? 1 : 0);
    const hasAnyFilter = activeFilterCount > 0 || filters.query.trim() !== "";
    const cityCount = new Set(data.map((d) => d.properties?.city)).size;

    return (
        <>
            <Hero schools={data} cityCount={cityCount} />
            <main className="relative mx-auto min-h-screen max-w-6xl px-4 pt-6">
                {/* Own wrapper so the sticky search bar stops at the end of the results, not over the Q&A */}
                <div>
                    <div className="sticky top-2 z-20 mb-4 flex flex-col gap-3 rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    value={filters.query}
                                    onChange={(e) => update({ query: e.target.value })}
                                    placeholder="Search schools, cities, fields"
                                    aria-label="Search schools"
                                    className="h-10 pl-9 pr-9 text-base [&::-webkit-search-cancel-button]:hidden"
                                />
                                {filters.query && (
                                    <button
                                        type="button"
                                        onClick={() => update({ query: "" })}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
                                        aria-label="Clear search"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                className="relative h-10 max-[359px]:px-3 sm:hidden"
                                onClick={() => setFiltersOpen((o) => !o)}
                                aria-expanded={filtersOpen}
                                aria-controls="school-filters"
                            >
                                <SlidersHorizontal />
                                <span className="max-[359px]:sr-only">Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        </div>

                        <div
                            id="school-filters"
                            className={cn("flex-col gap-2 sm:flex sm:flex-row sm:items-center", filtersOpen ? "flex" : "hidden")}
                        >
                            {/* Only worth showing when there's a choice beyond "All" and one type */}
                            {options.systems.length > 2 && (
                                <div role="radiogroup" aria-label="School type" className="flex rounded-lg bg-muted p-1 text-sm">
                                    {options.systems.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            role="radio"
                                            aria-checked={filters.type === opt.value}
                                            onClick={() => update({ type: opt.value })}
                                            className={cn(
                                                "flex-1 cursor-pointer whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-muted-foreground transition-colors",
                                                filters.type === opt.value && "bg-background text-foreground shadow-xs"
                                            )}
                                        >
                                            {opt.value === "University of Applied Sciences" ? "UAS" : opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {(savedIds.length > 0 || savedOnly) && (
                                <button
                                    type="button"
                                    aria-pressed={savedOnly}
                                    onClick={() => setSavedOnly((v) => !v)}
                                    className={cn(
                                        "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:h-10",
                                        savedOnly && "border-foreground bg-foreground text-background hover:text-background"
                                    )}
                                >
                                    <Heart className={cn("size-4", savedOnly && "fill-current")} />
                                    Saved ({savedIds.length})
                                </button>
                            )}
                            <div className="grid flex-1 gap-2 min-[360px]:grid-cols-2">
                                <FilterCombobox
                                    options={options.cities}
                                    placeholder="City"
                                    value={filters.city}
                                    onChange={(city) => update({ city })}
                                    className="min-w-0"
                                />
                                <FilterCombobox
                                    options={options.fields}
                                    placeholder="Field of study"
                                    value={filters.field}
                                    onChange={(field) => update({ field })}
                                    className="min-w-0"
                                />
                            </div>
                        </div>

                        <div className="flex min-h-6 flex-wrap items-center gap-2 text-sm">
                            <p className="text-muted-foreground" aria-live="polite">
                                {loading ? "Loading…" : `${results.length} ${results.length === 1 ? "school" : "schools"}`}
                            </p>
                            {activeChips.map((chip) => (
                                <button
                                    key={chip.key}
                                    type="button"
                                    onClick={chip.clear}
                                    className="inline-flex cursor-pointer items-center gap-1 rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-medium hover:bg-secondary/70"
                                    aria-label={`Remove filter ${chip.label}`}
                                >
                                    {chip.label}
                                    <X className="size-3" />
                                </button>
                            ))}
                            {hasAnyFilter && (
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="ml-auto cursor-pointer text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="pb-10">
                        {loading && (
                            <div className={GRID}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <SchoolCardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {!loading && error && (
                            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
                                <p className="font-medium">Couldn&apos;t load schools</p>
                                <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
                                <Button variant="outline" size="sm" onClick={() => fetchData(country, { force: true })}>
                                    <RotateCcw />
                                    Retry
                                </Button>
                            </div>
                        )}

                        {!loading && !error && data.length > 0 && results.length === 0 && (
                            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
                                <SearchX className="size-8 text-muted-foreground" />
                                <p className="font-medium">No schools match your search</p>
                                <p className="text-sm text-muted-foreground">Try a different keyword or remove some filters.</p>
                                <Button variant="outline" size="sm" onClick={clearAll}>
                                    Clear all filters
                                </Button>
                            </div>
                        )}

                        {!loading && (
                            <div className={GRID}>
                                {visibleItems.map((school) => (
                                    <SchoolCard key={school._id} school={school} />
                                ))}
                            </div>
                        )}

                        {!loading && visibleItems.length < results.length && (
                            <div ref={ref} className={cn(GRID, "mt-4")}>
                                <SchoolCardSkeleton />
                            </div>
                        )}
                    </div>

                </div>

                <div className="fixed bottom-3 right-3 z-20 sm:bottom-6 sm:right-4 flex flex-col items-end gap-2">
                    {showScrollTop && (
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full bg-background shadow-lg"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            aria-label="Scroll to top"
                        >
                            <ArrowUp />
                        </Button>
                    )}
                    {hasMap && (
                        <Button asChild className="rounded-full shadow-lg">
                            <Link href={path("/map")}>
                                <MapIcon />
                                Map view
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="mx-auto max-w-3xl">
                    <Breaker className="m-auto mb-10 w-full sm:w-[60%]" />
                    <QnA />
                    <SubFooter />
                </div>

                {/* Campus rows stay plain here instead of jumping to the map */}
                <SchoolDetailDialog campusLinks={false} />
                <SchoolDrawer campusLinks={false} />
            </main>
        </>
    );
}

export default function UniversityListPage() {
    return (
        <Suspense>
            <UniversityList />
        </Suspense>
    );
}
