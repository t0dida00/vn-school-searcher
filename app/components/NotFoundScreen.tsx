"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map as MapIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COUNTRIES, countryPath, DEFAULT_COUNTRY, isCountry, type CountryCode } from "../lib/countries";
import LostStudentArt, { type LostScene } from "./LostStudentArt";

type Theme = {
    scene: LostScene;
    // Page background, top to bottom
    sky: string;
    Decor: () => React.ReactElement;
};

// Twinkling stars, as [left %, top %]
const STARS = [
    [8, 12], [18, 30], [27, 8], [38, 22], [62, 10], [71, 28], [83, 14], [92, 34], [12, 48], [88, 52], [50, 4], [56, 36],
];

function Stars() {
    return (
        <>
            {STARS.map(([x, y], i) => (
                <span
                    key={i}
                    className="absolute size-0.5 rounded-full bg-white motion-safe:animate-pulse"
                    style={{ left: `${x}%`, top: `${y}%`, opacity: 0.4 + (i % 3) * 0.2, animationDelay: `${i * 0.4}s` }}
                />
            ))}
        </>
    );
}

// Night sky over Finland: a soft aurora and a few stars
function Aurora() {
    return (
        <>
            <div className="absolute -left-1/4 top-[18%] h-48 w-[150%] -rotate-6 rounded-[100%] bg-[radial-gradient(closest-side,rgba(52,211,153,0.28),transparent)] blur-2xl" />
            <div className="absolute -right-1/4 top-[28%] h-40 w-[120%] rotate-3 rounded-[100%] bg-[radial-gradient(closest-side,rgba(56,189,248,0.2),transparent)] blur-2xl" />
            <Stars />
        </>
    );
}

// Dusk over Vietnam: a low sun glow and silk lanterns drifting up, as [left %, top %, size px]
const LANTERNS = [
    [6, 18, 26], [16, 46, 18], [26, 10, 14], [74, 14, 22], [84, 40, 28], [93, 20, 16], [60, 6, 12], [3, 60, 12],
];

function Lanterns() {
    return (
        <>
            <div className="absolute -left-1/4 top-[55%] h-56 w-[150%] rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,196,92,0.35),transparent)] blur-2xl" />
            {LANTERNS.map(([x, y, size], i) => (
                <span
                    key={i}
                    // On phones the copy and stacked buttons span the full width, so drop the lanterns at their height
                    className={cn("absolute flex flex-col items-center motion-safe:animate-bounce", y > 8 && y < 50 && "max-sm:hidden")}
                    style={{ left: `${x}%`, top: `${y}%`, animationDuration: `${3 + (i % 3)}s`, animationDelay: `${i * 0.3}s` }}
                >
                    <span className="h-[3px] rounded-sm bg-amber-900/80" style={{ width: size * 0.45 }} />
                    <span
                        className="rounded-[45%] shadow-[0_0_18px_6px_rgba(255,170,60,0.45)]"
                        style={{
                            width: size,
                            height: size * 1.15,
                            background: i % 3 === 1 ? "radial-gradient(circle at 50% 40%,#ffe08a,#f5a623)" : "radial-gradient(circle at 50% 40%,#ff9b6b,#d9381e)",
                        }}
                    />
                    <span className="h-[3px] rounded-sm bg-amber-900/80" style={{ width: size * 0.45 }} />
                    <span className="h-2 w-px bg-amber-200/60" />
                </span>
            ))}
        </>
    );
}

// Countries without their own theme fall back to GENERIC
const THEMES: Partial<Record<CountryCode, Theme>> = {
    fi: { scene: "fi", sky: "linear-gradient(180deg,#000 0%,#03141a 38%,#1d5566 75%,#3f8fa8 100%)", Decor: Aurora },
    vn: { scene: "vn", sky: "linear-gradient(180deg,#160a24 0%,#4a1636 34%,#a3302a 70%,#e8893a 100%)", Decor: Lanterns },
};
const GENERIC: Theme = { scene: "generic", sky: "linear-gradient(180deg,#070b1f 0%,#121c45 45%,#2a4a8c 80%,#4f74b8 100%)", Decor: Stars };

// The 404 page is outside the /[country] route params (unmatched URLs reach the root not-found), so read
// the country from the first path segment
function useCountryFromPath(): CountryCode | null {
    const first = usePathname()?.split("/")[1];
    return isCountry(first) ? first : null;
}

export default function NotFoundScreen() {
    const country = useCountryFromPath();
    const theme = (country && THEMES[country]) || GENERIC;
    const config = COUNTRIES[country ?? DEFAULT_COUNTRY];
    const path = (p: string) => countryPath(country ?? DEFAULT_COUNTRY, p);
    const { Decor } = theme;

    // not-found.tsx can't know the country for its metadata, so put the brand in the tab title here
    useEffect(() => {
        if (country) document.title = `Page not found · ${config.brand}`;
    }, [country, config.brand]);

    return (
        <main
            className="relative flex min-h-dvh flex-col items-center overflow-hidden px-4 pb-6 pt-14 text-center text-white sm:pt-20"
            style={{ background: theme.sky }}
        >
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <Decor />
            </div>

            <div className="relative flex w-full max-w-xl flex-col items-center">
                <p className="mb-3 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs tracking-widest text-white/70">ERROR 404</p>
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">Oops!</h1>
                <p className="mt-4 max-w-md text-white/70 sm:text-lg">
                    The page you&apos;re looking for has moved or doesn&apos;t exist. Even the best students get lost sometimes.
                </p>
                <div className="mt-7 flex w-full flex-col gap-2 min-[360px]:w-auto min-[360px]:flex-row">
                    <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                        <Link href={path("/university-list")}>
                            <Search />
                            Browse schools
                        </Link>
                    </Button>
                    {config.hasMap && (
                        <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">
                            <Link href={path("/map")}>
                                <MapIcon />
                                Open the map
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <LostStudentArt scene={theme.scene} className="relative mt-6 w-full max-w-2xl sm:mt-8" />
        </main>
    );
}
