"use client";
import React, { useState } from "react";
import { ExternalLink, GraduationCap, MapPin, Phone, Wallet } from "lucide-react";
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stringToArray } from "../../utils/stringToArray";

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
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1 min-[360px]:size-16 min-[360px]:p-1.5 sm:size-20">
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

function InfoBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-lg bg-muted/60 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {icon}
                {title}
            </div>
            <p className="text-sm leading-relaxed">{children}</p>
        </div>
    );
}

export default function SchoolCard({ school }: { school: any }) {
    const { name, code, city, type, logo, overview, tuition, scholarship, website, phone, fieldOptions } =
        school.properties || {};
    const fields = stringToArray(fieldOptions);
    const hiddenCount = fields.length - MAX_VISIBLE_FIELDS;

    return (
        <AccordionItem
            value={school._id}
            className="rounded-xl border bg-card shadow-xs transition-shadow last:border-b hover:shadow-md data-[state=open]:shadow-md"
        >
            <AccordionTrigger className="min-w-0 cursor-pointer items-center gap-3 p-3 hover:no-underline sm:gap-4 sm:p-4 [&>svg]:size-5">
                <SchoolLogo src={logo} name={name ?? ""} />
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {city}
                        </span>
                        {code && <span aria-hidden>·</span>}
                        {code && <span className="font-mono">{code}</span>}
                    </div>
                    <span className="block text-base font-semibold leading-snug [overflow-wrap:anywhere] sm:text-lg">{name}</span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge variant={type === "University" ? "default" : "secondary"}>
                            {type === "University of Applied Sciences" ? "UAS" : type}
                        </Badge>
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
                </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 px-3 pb-4 sm:px-4">
                <div className="border-t pt-4" />
                {overview && <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">{overview}</p>}

                {(tuition || scholarship) && (
                    <div className="grid gap-2 sm:grid-cols-2">
                        {tuition && (
                            <InfoBlock icon={<Wallet className="size-3.5" />} title="Tuition">
                                {tuition}
                            </InfoBlock>
                        )}
                        {scholarship && (
                            <InfoBlock icon={<GraduationCap className="size-3.5" />} title="Scholarship">
                                {scholarship}
                            </InfoBlock>
                        )}
                    </div>
                )}

                {hiddenCount > 0 && (
                    <div>
                        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            All fields of study
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {fields.map((field) => (
                                <Badge key={field} variant="outline" className="max-w-full font-normal whitespace-normal">
                                    {field}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    {website && (
                        <Button asChild size="sm">
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                Visit website
                                <ExternalLink />
                            </a>
                        </Button>
                    )}
                    {phone && (
                        <Button asChild size="sm" variant="outline">
                            <a href={`tel:${phone.replace(/\s/g, "")}`}>
                                <Phone />
                                {phone}
                            </a>
                        </Button>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

export function SchoolCardSkeleton() {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4" aria-hidden>
            <div className="size-12 shrink-0 animate-pulse rounded-lg bg-muted min-[360px]:size-16 sm:size-20" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="flex gap-1.5">
                    <div className="h-5 w-12 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                </div>
            </div>
        </div>
    );
}
