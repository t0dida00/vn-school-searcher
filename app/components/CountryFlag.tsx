import React from "react";
import { cn } from "@/lib/utils";
import type { Country } from "../lib/countries";

// The Vietnamese flag's star: outer radius 1, inner 0.382, point up; spans y -1 to 0.809
export const STAR_POINTS = "0,-1 0.2245,-0.309 0.9511,-0.309 0.3633,0.118 0.5878,0.809 0,0.382 -0.5878,0.809 -0.3633,0.118 -0.9511,-0.309 -0.2245,-0.309";

// A flag's shapes and its viewBox, in the flag's real proportions, drawn from the country's hero colours.
// Shared by CountryFlag and the landing page's book, which draws flags onto its pages.
export function flagArt(hero: Country["hero"]): { viewBox: string; shapes: React.ReactNode } {
    const { flag, background } = hero;
    if (flag?.kind === "cross") {
        // Nordic cross, 18:11 with 3-unit arms offset toward the hoist (Finland)
        return {
            viewBox: "0 0 18 11",
            shapes: (
                <>
                    <rect width="18" height="11" fill={flag.field} />
                    <rect x="5" width="3" height="11" fill={background} />
                    <rect y="4" width="18" height="3" fill={background} />
                </>
            ),
        };
    }
    // 3:2 field; the star's circumradius is a fifth of the flag's length (Vietnam)
    return {
        viewBox: "0 0 3 2",
        shapes: (
            <>
                <rect width="3" height="2" fill={background} />
                {flag?.kind === "star" && <polygon points={STAR_POINTS} fill={flag.color} transform="translate(1.5 1) scale(0.6)" />}
            </>
        ),
    };
}

// A small flag drawn from the country's hero colours, in the flag's real proportions
export default function CountryFlag({ hero, className }: { hero: Country["hero"]; className?: string }) {
    const { viewBox, shapes } = flagArt(hero);
    return (
        <svg aria-hidden viewBox={viewBox} className={cn("rounded-sm ring-1 ring-black/10", className)}>
            {shapes}
        </svg>
    );
}
