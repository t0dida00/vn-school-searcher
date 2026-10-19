import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountryFlag from "../components/CountryFlag";
import Footer from "../components/Footer";
import CountriesLayout from "./CountriesLayout";
import { COUNTRIES, COUNTRY_CODES, countryPath } from "../lib/countries";
import { getSchools } from "../lib/schools";

// Every country the app supports (app/lib/countries.ts). Static like /school/[id]: it reads MongoDB
// directly for the school counts, so it prerenders during `next build`
export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Countries",
    description: `Search for universities in ${COUNTRY_CODES.map((c) => COUNTRIES[c].name).join(" and ")}`,
};

export default async function CountriesPage() {
    const schoolsByCountry = await Promise.all(COUNTRY_CODES.map((code) => getSchools(code)));
    const counts = schoolsByCountry.map((schools) => schools.length);
    // Only what the globe's pins and popups need, to keep the page payload small
    const globe = COUNTRY_CODES.map((code, i) => ({
        code,
        schools: schoolsByCountry[i].map(({ geometry, properties: p }) => ({
            type: "Feature",
            geometry,
            properties: { id: p.id, name: p.name, city: p.city, logo: p.logo, ranking: p.ranking, campuses: p.campuses },
        })),
    }));

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:pb-12 sm:pt-20">
                    <h1 className="text-center text-3xl font-black tracking-tight sm:text-5xl">Choose a country</h1>
                    <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground sm:text-lg">
                        Search and compare universities, with uniRank 2026 positions, in {COUNTRY_CODES.length} countries.
                    </p>
                </div>

                <div className="mx-auto max-w-7xl px-4 pb-12 sm:pb-20">
                    <CountriesLayout globe={globe}>
                        {/* One column beside the globe; two once the globe is expanded across the row (or on tablets) */}
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:group-data-[expanded=true]:grid-cols-2">
                            {COUNTRY_CODES.map((code, i) => {
                                const { name, brand, logo, hasMap, hero } = COUNTRIES[code];
                                return (
                                    <li key={code} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
                                        <div className="flex items-center gap-4">
                                            <CountryFlag hero={hero} className="h-12 w-auto shrink-0 sm:h-14" />
                                            <div className="min-w-0">
                                                <h2 className="text-xl font-bold sm:text-2xl">{name}</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    {counts[i]} {counts[i] === 1 ? "university" : "universities"}
                                                </p>
                                            </div>
                                            <Image src={logo} alt={brand} width={48} height={48} className="ml-auto size-12 shrink-0 object-contain max-[320px]:hidden" />
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <Button asChild className="flex-1 text-white hover:opacity-90" style={{ backgroundColor: hero.background }}>
                                                <Link href={countryPath(code, "/university-list")}>
                                                    Browse universities
                                                    <ChevronRight />
                                                </Link>
                                            </Button>
                                            {hasMap && (
                                                <Button asChild variant="outline">
                                                    <Link href={countryPath(code, "/map")}>
                                                        <MapIcon />
                                                        Map
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </CountriesLayout>
                </div>
            </main>
            <Footer />
        </>
    );
}
