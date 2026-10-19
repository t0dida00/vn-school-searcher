"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Map as MapIcon, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { schoolId } from "../../../utils/schoolId";
import styles from "../../../components/styles/hero.module.scss";
import { useCountryConfig, useCountryPath } from "../../../utils/useCountry";
import { STAR_POINTS } from "../../../components/CountryFlag";

const HOLD_MS = 2200;
// Long enough for the last letter's staggered exit to finish
const LEAVE_MS = 320 + 22 * 13;

function RotatingWord({ words }: { words: readonly string[] }) {
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        // Respect reduced motion: settle on the catch-all word and stop
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setIndex(words.length - 1);
            return;
        }
        const timer = setTimeout(
            () => {
                if (!leaving) return setLeaving(true);
                setIndex((i) => (i + 1) % words.length);
                setLeaving(false);
            },
            leaving ? LEAVE_MS : HOLD_MS
        );
        return () => clearTimeout(timer);
    }, [index, leaving, words]);

    return (
        // key restarts the entry animation for every new word
        <span key={index} className={cn(styles.word, leaving && styles.leaving)}>
            {[...(words[index] ?? "")].map((ch, i) => (
                <span key={i} className={styles.letter} style={{ "--i": i } as React.CSSProperties}>
                    {/* A lone space in an inline-block collapses ("Da Nang." would read "DANANG.") */}
                    {ch === " " ? " " : ch}
                </span>
            ))}
        </span>
    );
}

// Decorative only: the strip just shows the schools, it doesn't open them
function LogoTile({ school }: { school: any }) {
    const { name, logo } = school.properties || {};
    const [failed, setFailed] = useState(false);

    return (
        <div title={name} className="flex h-16 w-32 shrink-0 select-none items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 sm:h-20 sm:w-40">
            {logo && !failed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={name ?? ""} loading="lazy" draggable={false} className="max-h-full max-w-full object-contain" onError={() => setFailed(true)} />
            ) : (
                <span className="line-clamp-2 text-xs font-semibold text-slate-600">{name}</span>
            )}
        </div>
    );
}

// Seconds per logo: a slow drift, roughly 25px/s whatever the row length
const SECONDS_PER_TILE = 7;

function MarqueeRow({ schools, reverse }: { schools: any[]; reverse?: boolean }) {
    return (
        <div className={styles.marquee} style={{ "--duration": `${Math.max(schools.length, 8) * SECONDS_PER_TILE}s` } as React.CSSProperties}>
            <div className={cn(styles.track, reverse && styles.reverse)}>
                <div className={styles.group}>
                    {schools.map((s) => (
                        <LogoTile key={schoolId(s)} school={s} />
                    ))}
                </div>
                {/* Second copy makes the loop seamless; hidden from assistive tech */}
                <div className={styles.group} aria-hidden>
                    {schools.map((s) => (
                        <LogoTile key={schoolId(s)} school={s} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// "universities and universities of applied sciences" in Finland, just "universities" where all are one type
function schoolKinds(schools: any[]) {
    return schools.some((s) => s.properties?.type === "University of Applied Sciences")
        ? "universities and universities of applied sciences"
        : "universities";
}

export default function Hero({ schools, cityCount }: { schools: any[]; cityCount: number }) {
    const path = useCountryPath();
    const { name, adjective, hasMap, hero } = useCountryConfig();
    const tiles = schools.filter((s) => s.properties?.logo);
    const cross = hero.flag?.kind === "cross" ? hero.flag : undefined;
    const star = hero.flag?.kind === "star" ? hero.flag : undefined;

    return (
        <section className="relative overflow-hidden text-white" style={{ backgroundColor: cross?.field ?? hero.background }}>
            {cross ? (
                // Upright arm of the cross, offset toward the hoist like the real flag; the
                // horizontal arm is the band behind the headline
                <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[22%] w-[clamp(3.5rem,13vw,11rem)]" style={{ backgroundColor: hero.background }} />
            ) : star ? (
                // The flag's star, centred on the whole hero. The viewBox is trimmed to the star's outline
                // so the gaps above and below it are equal; softened so the white text stays readable
                <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <svg viewBox="-1 -1 2 1.809" className="h-[90%] w-auto max-w-[96%]" style={{ opacity: star.opacity }}>
                        <polygon points={STAR_POINTS} fill={star.color} />
                    </svg>
                </div>
            ) : (
                // Soft light from above so the flat colour has some depth
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(255,255,255,0.18),transparent)]" />
            )}

            <div className={cn("relative flex justify-center px-4", cross ? "py-8 sm:py-10" : "pt-10 sm:pt-16")}>
                <span
                    className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold sm:text-sm",
                        // On a white field the pill sits over white and blue alike, so make it solid
                        cross ? "bg-white shadow-sm ring-1 ring-black/10" : "bg-white/20 text-white"
                    )}
                    style={cross ? { color: hero.background } : undefined}
                >
                    <Trophy className="size-3.5" />
                    With uniRank 2026 positions
                </span>
            </div>

            <div className="relative" style={cross ? { backgroundColor: hero.background } : undefined}>
                <div className={cn("mx-auto flex max-w-6xl flex-col items-center px-4 text-center", cross ? "py-10 sm:py-14" : "pb-10 pt-6 sm:pb-14")}>
                    <h1
                        className={cn(styles.title, "font-black uppercase tracking-tight")}
                        style={{ textShadow: `0 2px 12px ${hero.shadow}` }}
                    >
                        <span className="sr-only">Find universities, fields and cities in {name}</span>
                        <span aria-hidden className="block">
                            <RotatingWord words={hero.words} />
                        </span>
                        <span aria-hidden className="block">In {name}.</span>
                    </h1>

                    <p className="mt-5 max-w-md font-medium text-white sm:text-lg">
                        {schools.length > 0
                            ? `Compare ${schools.length} ${schoolKinds(schools)} across ${cityCount} cities.`
                            : `Easily find information about ${adjective} universities.`}
                    </p>

                    {hasMap && (
                        <Link
                            href={path("/map")}
                            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/30"
                        >
                            <MapIcon className="size-4" />
                            Explore them on the map
                            <ChevronRight className="size-4" />
                        </Link>
                    )}
                </div>
            </div>

            <div className={cn("relative flex flex-col gap-3 pb-10 sm:pb-14", cross && "pt-8 sm:pt-10")}>
                {tiles.length > 0 ? (
                    <>
                        <MarqueeRow schools={tiles.filter((_, i) => i % 2 === 0)} />
                        <MarqueeRow schools={tiles.filter((_, i) => i % 2 === 1)} reverse />
                    </>
                ) : (
                    [0, 1].map((row) => (
                        <div key={row} className="flex justify-center gap-3 px-4" aria-hidden>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className={cn("h-16 w-32 shrink-0 animate-pulse rounded-2xl sm:h-20 sm:w-40", cross ? "bg-black/5" : "bg-white/25")} />
                            ))}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
