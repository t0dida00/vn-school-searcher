import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountryFlag from "../components/CountryFlag";
import Footer from "../components/Footer";
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
    const counts = await Promise.all(COUNTRY_CODES.map(async (code) => (await getSchools(code)).length));

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
                    <h1 className="text-center text-3xl font-black tracking-tight sm:text-5xl">Choose a country</h1>
                    <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground sm:text-lg">
                        Search and compare universities, with uniRank 2026 positions, in {COUNTRY_CODES.length} countries.
                    </p>

                    <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2">
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
                </div>
            </main>
            <Footer />
        </>
    );
}
