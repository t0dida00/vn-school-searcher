"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { rankOf } from "../utils/ranking";
import { useCountryConfig } from "../utils/useCountry";

/** "#2" shown right after a school's name; renders nothing for unranked schools */
export default function RankTag({ school, className }: { school: any; className?: string }) {
    const { ranking } = useCountryConfig();
    const rank = rankOf(school);
    if (!rank) return null;
    return (
        <span
            title={`#${rank} in the ${ranking.source}`}
            className={cn(
                "inline-flex shrink-0 items-center rounded-md bg-amber-100 px-1.5 align-middle text-xs font-semibold leading-5 text-amber-900 tabular-nums",
                className
            )}
        >
            <span className="sr-only">Ranked </span>#{rank}
        </span>
    );
}
