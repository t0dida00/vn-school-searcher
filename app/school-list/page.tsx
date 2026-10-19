"use client";
import React, { Suspense, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUp, Map as MapIcon, RotateCcw, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { FilterCombobox } from "../components/FilterCombobox";
import { Input } from "@/components/ui/input";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useDataStore from "../zustand/useDataStore";
import { EMPTY_FILTERS, matchSchool, type SchoolFilters as Filters } from "../utils/matchSchool";
import SchoolCard, { SchoolCardSkeleton } from "./components/SchoolCard";
import SubFooter from "./components/SubFooter";
import QnA from "./components/QnA";
import Breaker from "./components/breaker";

const PAGE_SIZE = 10;

type Option = { label: string; value: string };

function UniversityList() {
    const searchParams = useSearchParams();
    const { data, fetchData, loading, error } = useDataStore();

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
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const update = (patch: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...patch }));

    useEffect(() => {
        if (!data.length) fetchData();
    }, []);

    useEffect(() => {
        fetch("/filter-options.json")
            .then((res) => res.json())
            .then(setOptions)
            .catch((err) => console.error("Failed to load filter options", err));
    }, []);

    // Keep filters in the URL so results can be shared and survive reloads
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.query.trim()) params.set("q", filters.query.trim());
        if (filters.city) params.set("city", filters.city);
        if (filters.field) params.set("field", filters.field);
        if (filters.type !== "all") params.set("type", filters.type);
        const qs = params.toString();
        window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
        setVisibleCount(PAGE_SIZE);
    }, [filters]);

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 600);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const deferredFilters = useDeferredValue(filters);
    const results = useMemo(
        () => data.filter((item) => matchSchool(item, deferredFilters)),
        [data, deferredFilters]
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
    const activeFilterCount = activeChips.length + (filters.type !== "all" ? 1 : 0);
    const hasAnyFilter = activeFilterCount > 0 || filters.query.trim() !== "";
    const cityCount = new Set(data.map((d) => d.properties?.city)).size;

    return (
        <main className="relative mx-auto min-h-screen max-w-3xl px-4">
            <section className="pb-6 pt-4 text-center sm:pt-8">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Find your school in Finland</h1>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                    {data.length > 0
                        ? `Compare ${data.length} universities and universities of applied sciences across ${cityCount} cities.`
                        : "Easily find information about Finnish universities."}
                </p>
            </section>

            <div className="sticky top-2 z-10 mb-4 flex flex-col gap-3 rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
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
                            onClick={() => setFilters(EMPTY_FILTERS)}
                            className="ml-auto cursor-pointer text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            <div className="pb-10">
                {loading && (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SchoolCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
                        <p className="font-medium">Couldn&apos;t load schools</p>
                        <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
                        <Button variant="outline" size="sm" onClick={() => fetchData()}>
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
                        <Button variant="outline" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                            Clear all filters
                        </Button>
                    </div>
                )}

                {!loading && (
                    <Accordion type="multiple" className="flex flex-col gap-3">
                        {visibleItems.map((school) => (
                            <SchoolCard key={school._id} school={school} />
                        ))}
                    </Accordion>
                )}

                {!loading && visibleItems.length < results.length && (
                    <div ref={ref} className="mt-3">
                        <SchoolCardSkeleton />
                    </div>
                )}
            </div>

            <div className="fixed bottom-6 right-4 z-20 flex flex-col items-end gap-2">
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
                <Button asChild className="rounded-full shadow-lg">
                    <Link href="/map">
                        <MapIcon />
                        Map view
                    </Link>
                </Button>
            </div>

            <Breaker className="m-auto mb-10 w-full sm:w-[60%]" />
            <QnA />
            <SubFooter />
        </main>
    );
}

export default function UniversityListPage() {
    return (
        <Suspense>
            <UniversityList />
        </Suspense>
    );
}
