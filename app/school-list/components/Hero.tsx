"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Map as MapIcon, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { schoolId } from "../../utils/schoolId";
import styles from "../../components/styles/hero.module.scss";

// Fields and cities from the data, ending on the catch-all
const WORDS = ["Universities.", "Engineering.", "Helsinki.", "Business.", "Tampere.", "Design.", "Oulu.", "Medicine.", "Turku.", "Everything."];
const HOLD_MS = 2200;
// Long enough for the last letter's staggered exit to finish
const LEAVE_MS = 320 + 22 * 13;

function RotatingWord() {
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        // Respect reduced motion: settle on the catch-all word and stop
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setIndex(WORDS.length - 1);
            return;
        }
        const timer = setTimeout(
            () => {
                if (!leaving) return setLeaving(true);
                setIndex((i) => (i + 1) % WORDS.length);
                setLeaving(false);
            },
            leaving ? LEAVE_MS : HOLD_MS
        );
        return () => clearTimeout(timer);
    }, [index, leaving]);

    return (
        // key restarts the entry animation for every new word
        <span key={index} className={cn(styles.word, leaving && styles.leaving)}>
            {[...WORDS[index]].map((ch, i) => (
                <span key={i} className={styles.letter} style={{ "--i": i } as React.CSSProperties}>
                    {ch}
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
        <div title={name} className="flex h-16 w-32 shrink-0 select-none items-center justify-center rounded-2xl bg-white p-3 shadow-sm sm:h-20 sm:w-40">
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

export default function Hero({ schools, cityCount }: { schools: any[]; cityCount: number }) {
    const tiles = schools.filter((s) => s.properties?.logo);

    return (
        <section className="relative overflow-hidden bg-[#00c2e8] text-white">
            {/* Soft light from above so the flat blue has some depth */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(255,255,255,0.18),transparent)]" />

            <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-10 pt-10 text-center sm:pb-14 sm:pt-16">
                <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white sm:text-sm">
                    <Trophy className="size-3.5" />
                    With uniRank 2026 positions
                </span>

                <h1 className={cn(styles.title, "font-black uppercase tracking-tight [text-shadow:0_2px_12px_rgba(0,80,110,0.25)]")}>
                    <span className="sr-only">Find universities, fields and cities in Finland</span>
                    <span aria-hidden className="block">
                        <RotatingWord />
                    </span>
                    <span aria-hidden className="block">In Finland.</span>
                </h1>

                <p className="mt-5 max-w-md font-medium text-white sm:text-lg">
                    {schools.length > 0
                        ? `Compare ${schools.length} universities and universities of applied sciences across ${cityCount} cities.`
                        : "Easily find information about Finnish universities."}
                </p>

                <Link
                    href="/map"
                    className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/30"
                >
                    <MapIcon className="size-4" />
                    Explore them on the map
                    <ChevronRight className="size-4" />
                </Link>
            </div>

            <div className="relative flex flex-col gap-3 pb-10 sm:pb-14">
                {tiles.length > 0 ? (
                    <>
                        <MarqueeRow schools={tiles.filter((_, i) => i % 2 === 0)} />
                        <MarqueeRow schools={tiles.filter((_, i) => i % 2 === 1)} reverse />
                    </>
                ) : (
                    [0, 1].map((row) => (
                        <div key={row} className="flex justify-center gap-3 px-4" aria-hidden>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-16 w-32 shrink-0 animate-pulse rounded-2xl bg-white/25 sm:h-20 sm:w-40" />
                            ))}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
