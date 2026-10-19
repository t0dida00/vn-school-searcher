"use client";
import React, { useEffect, useId, useState } from "react";
import styles from "./styles/mapLoading.module.scss";
import { COUNTRY_MAPS } from "../map/countryMaps";
import { useCountry } from "../utils/useCountry";

// Shared by MapWrapper's dynamic() placeholder and Map's own "rendering" phase, so the hand-off between
// the two looks like one continuous loading state: a folded paper map of the country while pins drop
// onto university cities.
// The message clock is shared by both mounts, so the hand-off doesn't restart the sequence.

// Same colours as the live map (app/map/layerConfig.ts)
const PAPER = "#fbf8f4";
const PAPER_FOLD = "#f1ebe2";
const PAPER_EDGE = "#e3d8c8";
const SAND = "#e9c9a6";
const SAND_BORDER = "#c49a72";
const INK = "#111827";
// Loader backdrop: bright sky behind the paper map
const SKY = "#00c2e8";

const MESSAGES = ["Unfolding the map", "Plotting the campuses", "Charting the route", "Almost there"];
const MESSAGE_MS = 900;
// When the first loader mounted; null until then and again after resetLoaderClock()
let loaderStartedAt: number | null = null;

function startLoaderClock() {
    if (loaderStartedAt === null) loaderStartedAt = Date.now();
    return loaderStartedAt;
}

// Call once the loader is gone, so the next visit to /map starts a fresh sequence
export function resetLoaderClock() {
    loaderStartedAt = null;
}

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);
    return reduced;
}

export default function MapLoading() {
    const uid = useId().replace(/:/g, "");
    const { path, cities, transform } = COUNTRY_MAPS[useCountry()].loader;
    const reducedMotion = usePrefersReducedMotion();
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (reducedMotion) return;
        const startedAt = startLoaderClock();
        // Derived from the shared clock, so the second mount picks up where the first left off
        const update = () =>
            setMessageIndex(Math.min(Math.floor((Date.now() - startedAt) / MESSAGE_MS), MESSAGES.length - 1));
        update();
        const timer = setInterval(update, 100);
        return () => clearInterval(timer);
    }, [reducedMotion]);

    return (
        <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 overflow-hidden px-6"
            style={{ background: SKY }}
            role="status"
            aria-live="polite"
        >
            <svg
                viewBox="0 0 320 260"
                className="h-auto max-h-[60%] w-[min(320px,78vw)]"
                aria-hidden
            >
                <defs>
                    <filter id={`shadow-${uid}`} x="-10%" y="-10%" width="120%" height="130%">
                        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.18" />
                    </filter>
                </defs>

                {/* Tri-fold paper map: the outer panels angle away like a half-open map */}
                <g filter={`url(#shadow-${uid})`}>
                    <polygon className={styles.panel} points="24,40 112,28 112,228 24,240" fill={PAPER_FOLD} stroke={PAPER_EDGE} />
                    <polygon className={styles.panel} points="112,28 208,28 208,228 112,228" fill={PAPER} stroke={PAPER_EDGE} />
                    <polygon className={styles.panel} points="208,28 296,40 296,240 208,228" fill={PAPER_FOLD} stroke={PAPER_EDGE} />
                </g>
                {/* Faint grid lines on the paper */}
                <g stroke={PAPER_EDGE} strokeWidth={0.8} opacity={0.7}>
                    {[78, 128, 178].map((y) => (
                        <line key={y} x1={30} x2={290} y1={y} y2={y} strokeDasharray="2 6" />
                    ))}
                </g>

                <g className={styles.country} transform={transform}>
                    <path d={path} fill={SAND} stroke={SAND_BORDER} strokeWidth={1.4} strokeLinejoin="round" />
                    {cities.map((city, i) => (
                        <g key={city.name} transform={`translate(${city.x} ${city.y})`}>
                            <circle r={5} fill={INK} className={styles.pulse} style={{ animationDelay: `${i * 1.2}s` }} />
                            {/* Pin with its tip on the city */}
                            <g className={styles.pin} style={{ animationDelay: `${i * 1.2}s` }}>
                                <path d="M0 0 C -2 -5, -7 -8, -7 -13 A 7 7 0 1 1 7 -13 C 7 -8, 2 -5, 0 0 Z" fill={INK} />
                                <circle cy={-13} r={2.8} fill={SAND} />
                            </g>
                        </g>
                    ))}
                </g>
            </svg>

            <p className="flex items-baseline text-base font-semibold text-white drop-shadow-sm">
                <span key={messageIndex} className={styles.message}>
                    {MESSAGES[messageIndex]}
                </span>
                <span className={styles.dots} aria-hidden>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </span>
            </p>
        </div>
    );
}
