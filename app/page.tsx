import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Heart, Map as MapIcon, MapPin, Search, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountryFlag from "./components/CountryFlag";
import CountriesLayout from "./components/landing/CountriesLayout";
import FlagBook from "./components/landing/FlagBook";
import Footer from "./components/Footer";
import SiteHeader from "./components/landing/SiteHeader";
import { MarqueeRow } from "./components/LogoMarquee";
import GeneralQnA from "./components/landing/GeneralQnA";
import { COUNTRIES, COUNTRY_CODES, countryPath } from "./lib/countries";
import { getSchools } from "./lib/schools";

// The landing page at / (the old /countries redirects here): the overall Unies header and footer, an introduction, and every
// country the app supports (app/lib/countries.ts). Static like /school/[id]: it reads MongoDB directly for
// the school counts and the globe, so it prerenders during `next build`
export const revalidate = 3600;

// Copy names no country: the list grows with app/lib/countries.ts
export const metadata: Metadata = {
    title: { absolute: "Unies: find a university abroad" },
    description: "Search and compare universities country by country, by city, field of study and ranking, and see every campus on a map.",
};

const FEATURES = [
    { icon: Search, title: "Search and filter", text: "Narrow the list by city or field of study, or look a school up by name." },
    { icon: Trophy, title: "See the ranking", text: "Each school shows its uniRank position in its country, so you can compare at a glance." },
    { icon: MapPin, title: "Open the map", text: "Every campus is pinned, including branch campuses in other cities." },
    { icon: Heart, title: "Keep a shortlist", text: "Save schools as you browse and come back to them later on the same device." },
];

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

    // The hero's logo band: each country's best-ranked schools with a logo, taken in turn so every country
    // shows up early in the strip
    const ranked = schoolsByCountry.map((schools) =>
        schools
            .filter((s) => s.properties?.logo)
            .sort((a, b) => (Number(a.properties.ranking) || 999) - (Number(b.properties.ranking) || 999))
            .map(({ properties: p }) => ({ properties: { id: p.id, name: p.name, logo: p.logo } }))
    );
    const strip = Array.from({ length: 24 }, (_, i) => ranked.map((list) => list[i])).flat().filter(Boolean).slice(0, 40);
    const heading = "font-[family-name:var(--font-slab)] font-bold tracking-tight text-[#191919]";

    return (
        <div>
            <SiteHeader />
            <main>
                <section className="overflow-hidden bg-[#E9A73A] text-[#191919]">
                    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:pb-14 lg:pt-24">
                        <div>
                            <h1 className={`${heading} max-w-[12ch] text-[clamp(2.5rem,8.5vw,5.75rem)] leading-[0.98]`}>Find a university abroad</h1>
                            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-[#191919]/85 sm:text-xl">
                                Search universities by city, field of study and ranking, then see every campus on a map.
                            </p>
                            <Button asChild size="lg" className="mt-8 h-12 bg-[#191919] px-6 text-base text-white hover:bg-[#191919]/85 focus-visible:ring-[#191919]/40">
                                <a href="#countries">Choose a country</a>
                            </Button>
                        </div>
                        <FlagBook countries={COUNTRY_CODES.map((c) => COUNTRIES[c])} className="mx-auto w-full max-w-sm drop-shadow-[0_18px_22px_rgba(25,25,25,0.22)] sm:max-w-md lg:max-w-lg" />
                    </div>
                    {/* Real schools drifting past, both directions; decorative */}
                    <div className="flex flex-col gap-3 pb-10 sm:pb-14">
                        {/* The strip alternates countries, so split it in pairs to mix them in both rows */}
                        <MarqueeRow schools={strip.filter((_, i) => i % 4 < 2)} />
                        <MarqueeRow schools={strip.filter((_, i) => i % 4 >= 2)} reverse />
                    </div>
                </section>

                <section className="border-b border-black/10 bg-white">
                    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:py-16 lg:grid-cols-[1fr_2fr] lg:gap-16">
                        <h2 className={`${heading} text-3xl sm:text-4xl`}>What you can do here</h2>
                        <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                            {FEATURES.map(({ icon: Icon, title, text }) => (
                                <div key={title}>
                                    <dt className="flex items-center gap-2.5 text-lg font-semibold text-[#191919]">
                                        <Icon aria-hidden className="size-5 shrink-0" />
                                        {title}
                                    </dt>
                                    <dd className="mt-1.5 max-w-[42ch] leading-relaxed text-[#191919]/75">{text}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                <section id="countries" className="scroll-mt-4 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:pb-10 sm:pt-16">
                    <h2 className={`${heading} text-3xl sm:text-4xl`}>Choose a country</h2>
                    <p className="mt-3 max-w-[52ch] text-[#191919]/75 sm:text-lg">
                        Browse a country&apos;s universities or open its map. On the globe, tap a flag to zoom in.
                    </p>
                </div>

                <div className="mx-auto max-w-7xl px-4 pb-12 sm:pb-20">
                    <CountriesLayout globe={globe}>
                        {/* One column beside the globe; two once the globe is expanded across the row (or on tablets) */}
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:group-data-[expanded=true]:grid-cols-2">
                            {COUNTRY_CODES.map((code, i) => {
                                const { name, hasMap, hero } = COUNTRIES[code];
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
                </section>

                <GeneralQnA headingClassName={heading} />
            </main>
            <Footer />
        </div>
    );
}
