"use client";
import React, { useState } from "react";
import { ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stringToArray } from "../../../utils/stringToArray";
import usePointStore from "../../../zustand/usePointStore";
import RankTag from "../../../components/RankTag";
import SaveButton from "../../../components/SaveButton";

const MAX_VISIBLE_FIELDS = 3;

function SchoolLogo({ src, name }: { src?: string; name: string }) {
    const [failed, setFailed] = useState(false);
    const initials = name
        .split(" ")
        .filter((w) => /^[A-ZÄÖÅ]/.test(w))
        .slice(0, 2)
        .map((w) => w[0])
        .join("");

    return (
        // Wide box: most school logos are wordmarks that shrink to nothing in a square
        <div className="flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1.5">
            {src && !failed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={`${name} logo`}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                    onError={() => setFailed(true)}
                />
            ) : (
                <span className="text-lg font-semibold text-muted-foreground">{initials}</span>
            )}
        </div>
    );
}

export default function SchoolCard({ school }: { school: any }) {
    const { name, code, city, type, logo, overview, website, fieldOptions } = school.properties || {};
    const fields = stringToArray(fieldOptions);
    const hiddenCount = fields.length - MAX_VISIBLE_FIELDS;

    // Same detail dialog (desktop) / drawer (phone) as the map
    const open = () => {
        const { setSelectedPoint, setIsOpen } = usePointStore.getState();
        setSelectedPoint(school);
        setIsOpen(true);
    };

    return (
        <article className="group relative flex h-full flex-col gap-3 rounded-xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md has-[button:focus-visible]:ring-[3px] has-[button:focus-visible]:ring-ring/50">
            <div className="flex items-start justify-between gap-3">
                <SchoolLogo src={logo} name={name ?? ""} />
                <div className="flex items-center gap-2">
                    <Badge variant={type === "University" ? "default" : "secondary"}>
                        {type === "University of Applied Sciences" ? "UAS" : type}
                    </Badge>
                    {/* Above the stretched button so it toggles instead of opening the card */}
                    <SaveButton school={school} className="relative z-[1] -mr-1 -mt-1 size-8 border-transparent shadow-none" />
                </div>
            </div>

            <div className="min-w-0">
                <h2 className="text-base font-semibold leading-snug [overflow-wrap:anywhere]">
                    {/* Stretched over the whole card so the card itself is the tap target */}
                    <button
                        type="button"
                        onClick={open}
                        className="text-left outline-none after:absolute after:inset-0 after:rounded-xl after:content-['']"
                    >
                        {name}
                    </button>
                    <RankTag school={school} className="ml-1.5" />
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {city}
                    </span>
                    {code && <span aria-hidden>·</span>}
                    {code && <span className="font-mono">{code}</span>}
                </div>
            </div>

            {overview && <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{overview}</p>}

            {fields.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {fields.slice(0, MAX_VISIBLE_FIELDS).map((field) => (
                        <Badge key={field} variant="outline" className="max-w-full font-normal" title={field}>
                            <span className="truncate">{field}</span>
                        </Badge>
                    ))}
                    {hiddenCount > 0 && (
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                            +{hiddenCount}
                        </Badge>
                    )}
                </div>
            )}

            <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                    View details
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
                {website && (
                    // Above the stretched button so it stays its own link
                    <Button asChild size="sm" variant="ghost" className="relative z-[1] -mr-2">
                        <a href={website} target="_blank" rel="noopener noreferrer">
                            Website
                            <ExternalLink />
                        </a>
                    </Button>
                )}
            </div>
        </article>
    );
}

export function SchoolCardSkeleton() {
    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-4" aria-hidden>
            <div className="flex justify-between">
                <div className="h-14 w-24 animate-pulse rounded-lg bg-muted" />
                <div className="h-5 w-12 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
                <div className="h-3 animate-pulse rounded bg-muted" />
                <div className="h-3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex gap-1.5">
                <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            </div>
        </div>
    );
}
