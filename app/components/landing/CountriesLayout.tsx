"use client";
import React, { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobeMapLoader from "../GlobeMapLoader";
import type { GlobeCountry } from "../GlobeMap";

// Desktop: country cards on the left (60%), the globe on the right (40%). The globe can expand across the
// whole row, with the cards moving below it in two columns. Phones and tablets stack the globe above the cards.
export default function CountriesLayout({ globe, children }: { globe: GlobeCountry[]; children: React.ReactNode }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div data-expanded={expanded} className={cn("group flex flex-col gap-6 lg:grid", expanded ? "lg:grid-cols-1" : "lg:grid-cols-[3fr_2fr]")}>
            {/* Globe first in the DOM so it sits on top on phones; on desktop it moves to the right column */}
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5",
                    "h-[380px] sm:h-[460px]",
                    expanded ? "lg:h-[640px]" : "lg:col-start-2 lg:row-start-1 lg:h-[540px]"
                )}
            >
                {/* Every school on one globe; drag to spin, tap a flag to zoom in, tap a logo for the school */}
                <GlobeMapLoader countries={globe} className="size-full" />
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    aria-pressed={expanded}
                    className="absolute left-3 top-3 z-10 hidden cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur transition-colors hover:bg-white lg:inline-flex"
                >
                    {expanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                    {expanded ? "Collapse map" : "Expand map"}
                </button>
            </div>

            <div className={cn(!expanded && "lg:col-start-1 lg:row-start-1")}>{children}</div>
        </div>
    );
}
