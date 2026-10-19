"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Check, ExternalLink, GraduationCap, LocateFixed, Mail, MapPin, Navigation, Phone, Share2, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stringToArray } from "@/app/utils/stringToArray";
import { schoolId } from "@/app/utils/schoolId";
import { campusesOf, campusSlug } from "@/app/utils/campuses";
import { useCountryConfig, useCountryPath } from "@/app/utils/useCountry";
import { getActiveMap, showOnMap } from "@/app/map/activeMap";
import SaveButton from "../SaveButton";

// Tuition/scholarship text is mostly plain but occasionally markdown
const Markdown = ({ children }: { children: string }) => (
    <div className="text-sm leading-relaxed [&_li]:mb-1 [&_p]:m-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
);

function Logo({ src, name, code }: { src?: string; name?: string; code?: string }) {
    const [failed, setFailed] = useState(false);
    return (
        <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2 shadow-xs">
            {src && !failed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={`${name} logo`} className="max-h-full max-w-full object-contain" onError={() => setFailed(true)} />
            ) : (
                <span className="text-sm font-bold text-muted-foreground">{(code ?? name ?? "?").slice(0, 4).toUpperCase()}</span>
            )}
        </div>
    );
}

function Fact({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl bg-muted/60 p-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {icon}
                {label}
            </div>
            {children}
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h3 className="mb-2 text-xl font-semibold">{title}</h3>
            {children}
        </section>
    );
}

// One row of the Campuses list. On the map it flies there; elsewhere it opens the map on that campus
// (/map?school=<id>&campus=<slug>). Plain text without a map for the country, or with `linkable` off.
function CampusRow({ school, campus, coordinates, linkable, children }: { school: any; campus?: string; coordinates?: [number, number]; linkable: boolean; children: React.ReactNode }) {
    const path = useCountryPath();
    const hasMap = useCountryConfig().hasMap && linkable;
    const rowClass = "flex w-full items-start gap-3 px-3 py-2.5 text-left";
    const label = `Show ${campus ?? "the main campus"} on the map`;
    const content = (
        <>
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1">{children}</span>
            {hasMap && coordinates && <LocateFixed aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-foreground" />}
        </>
    );
    if (!hasMap || !coordinates) return <li className={rowClass}>{content}</li>;
    const interactive = `${rowClass} group transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none`;
    return (
        <li>
            {getActiveMap() ? (
                <button type="button" onClick={() => showOnMap(coordinates)} aria-label={label} title={label} className={interactive}>
                    {content}
                </button>
            ) : (
                <Link
                    href={path(`/map?school=${encodeURIComponent(schoolId(school))}${campus ? `&campus=${campusSlug(campus)}` : ""}`)}
                    aria-label={label}
                    title={label}
                    className={interactive}
                >
                    {content}
                </Link>
            )}
        </li>
    );
}

/** Title block: rendered inside the dialog/drawer title so it's announced as the heading */
export function SchoolDetailHeader({ school, title }: { school: any; title: React.ReactNode }) {
    const { name, code, city, type, logo, campus } = school?.properties || {};
    return (
        <div className="flex items-center gap-4 text-left">
            <Logo src={logo} name={name} code={code} />
            <div className="min-w-0">
                {title}
                {/* Opened from one of the school's other campuses (see campusView) */}
                {campus && <p className="mt-0.5 text-sm font-medium text-foreground/80">{campus}</p>}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {city}
                    </span>
                    {type && (
                        <Badge variant={type === "University" ? "default" : "secondary"}>
                            {type === "University of Applied Sciences" ? "UAS" : type}
                        </Badge>
                    )}
                    {code && <span className="font-mono text-xs">{code}</span>}
                </div>
            </div>
        </div>
    );
}

// Stands in for SchoolDetailBody while the map's dialog loads the school's details (useSchoolDetails)
export function SchoolDetailBodyPending({ error, onRetry }: { error?: string | null; onRetry?: () => void }) {
    if (error) {
        return (
            <div className="flex flex-col items-center gap-3 py-8 text-center text-sm">
                <p className="text-muted-foreground">Couldn&apos;t load this school&apos;s details.</p>
                {onRetry && (
                    <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                        Try again
                    </Button>
                )}
            </div>
        );
    }
    const bar = "animate-pulse rounded bg-muted";
    return (
        <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading details">
            <section className="flex flex-col gap-2">
                <div className={`${bar} mb-1 h-6 w-24`} />
                <div className={`${bar} h-4 w-full`} />
                <div className={`${bar} h-4 w-full`} />
                <div className={`${bar} h-4 w-2/3`} />
            </section>
            <section className="flex flex-col gap-2">
                <div className={`${bar} mb-1 h-6 w-40`} />
                <div className="flex flex-wrap gap-2">
                    {[20, 28, 24, 16].map((w) => (
                        <div key={w} className={`${bar} h-6`} style={{ width: `${w * 4}px` }} />
                    ))}
                </div>
            </section>
        </div>
    );
}

// `campusLinks`: whether Campuses rows show the campus on the map (off on the university list)
export function SchoolDetailBody({ school, campusLinks = true }: { school: any; campusLinks?: boolean }) {
    const { overview, tuition, scholarship, fieldOptions, phone, email, address, city, mainCity, mainCoordinates, campus: viewedCampus } = school?.properties || {};
    const fields = stringToArray(fieldOptions);
    const campuses = campusesOf(school);
    const [expanded, setExpanded] = useState(false);
    // Only offer "Read more" when the clamp actually hides text at the current width
    const overviewRef = useRef<HTMLParagraphElement>(null);
    const [clamped, setClamped] = useState(false);
    useLayoutEffect(() => {
        const el = overviewRef.current;
        if (el && !expanded) setClamped(el.scrollHeight > el.clientHeight + 1);
    }, [overview, expanded]);

    return (
        <div className="flex flex-col gap-5">
            {overview && (
                <Section title="About">
                    <p ref={overviewRef} className={`text-sm leading-relaxed text-foreground/90 ${expanded ? "" : "line-clamp-4"}`}>
                        {overview}
                    </p>
                    {(clamped || expanded) && (
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="mt-1 cursor-pointer text-sm font-medium underline-offset-4 hover:underline"
                        >
                            {expanded ? "Show less" : "Read more"}
                        </button>
                    )}
                </Section>
            )}

            {(tuition || scholarship) && (
                <div className="grid gap-2">
                    {tuition && (
                        <Fact icon={<Wallet className="size-3.5" />} label="Tuition">
                            <Markdown>{tuition}</Markdown>
                        </Fact>
                    )}
                    {scholarship && (
                        <Fact icon={<GraduationCap className="size-3.5" />} label="Scholarship">
                            <Markdown>{scholarship}</Markdown>
                        </Fact>
                    )}
                </div>
            )}

            {fields.length > 0 && (
                <Section title={`Fields of study (${fields.length})`}>
                    <div className="flex flex-wrap gap-1.5">
                        {fields.map((field) => (
                            <Badge key={field} variant="outline" className="max-w-full whitespace-normal font-normal">
                                {field}
                            </Badge>
                        ))}
                    </div>
                </Section>
            )}

            {campuses.length > 0 && (
                <Section title={`Campuses (${campuses.length + 1})`}>
                    <ul className="flex flex-col divide-y overflow-hidden rounded-xl border text-sm">
                        {/* Opened from a campus pin, geometry is that campus's; mainCoordinates keeps the main one */}
                        <CampusRow school={school} coordinates={mainCoordinates ?? school?.geometry?.coordinates} linkable={campusLinks}>
                            <span className="font-medium">{mainCity ?? city}</span>
                            <span className="text-muted-foreground"> · main campus</span>
                        </CampusRow>
                        {campuses.map((campus) => (
                            <CampusRow key={campus.name} school={school} campus={campus.name} coordinates={campus.coordinates} linkable={campusLinks}>
                                <span className="font-medium">{campus.name}</span>
                                {campus.name === viewedCampus && <span className="text-muted-foreground"> · this campus</span>}
                                <span className="block text-muted-foreground">{campus.address || campus.city}</span>
                            </CampusRow>
                        ))}
                    </ul>
                </Section>
            )}

            {(phone || email || address) && (
                <Section title="Contact">
                    <div className="flex flex-col divide-y rounded-xl border text-sm">
                        {address && (
                            <div className="flex items-center gap-3 px-3 py-2.5">
                                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                                {address}
                            </div>
                        )}
                        {phone && (
                            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60">
                                <Phone className="size-4 shrink-0 text-muted-foreground" />
                                {phone}
                            </a>
                        )}
                        {email && (
                            <a href={`mailto:${email}`} className="flex items-center gap-3 px-3 py-2.5 break-all hover:bg-muted/60">
                                <Mail className="size-4 shrink-0 text-muted-foreground" />
                                {email}
                            </a>
                        )}
                    </div>
                </Section>
            )}
        </div>
    );
}

function ShareButton({ school }: { school: any }) {
    const [copied, setCopied] = useState(false);
    const path = useCountryPath();
    const name = school?.properties?.name ?? "School";

    const share = async () => {
        const url = `${window.location.origin}${path(`/school/${schoolId(school)}`)}`;
        if (navigator.share) {
            // Rejects when the user cancels the share sheet; nothing to do then
            await navigator.share({ title: name, url }).catch(() => {});
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt("Copy this link", url);
        }
    };

    return (
        <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={share}
            aria-label={copied ? "Link copied" : `Share ${name}`}
            title={copied ? "Link copied" : "Share"}
            className="shrink-0"
        >
            {copied ? <Check /> : <Share2 />}
        </Button>
    );
}

// `pending`: the details (and so the website) are still loading, so hold the website button's place
export function SchoolDetailActions({ school, pending = false }: { school: any; pending?: boolean }) {
    const { website } = school?.properties || {};
    const coords = school?.geometry?.type === "Point" ? school.geometry.coordinates : null;
    return (
        <div className="flex gap-2">
            {pending && (
                <Button type="button" disabled className="min-w-0 flex-1">
                    <span className="max-[399px]:hidden">Visit website</span>
                    <span className="min-[400px]:hidden">Website</span>
                    <ExternalLink />
                </Button>
            )}
            {!pending && website && (
                <Button asChild className="min-w-0 flex-1">
                    <a href={website} target="_blank" rel="noopener noreferrer">
                        {/* Shorter label so four buttons fit on a 280px Galaxy Fold */}
                        <span className="max-[399px]:hidden">Visit website</span>
                        <span className="min-[400px]:hidden">Website</span>
                        <ExternalLink />
                    </a>
                </Button>
            )}
            {coords && (
                <Button asChild variant="outline" className="min-w-0 flex-1 max-[399px]:flex-none max-[399px]:px-0 max-[399px]:size-9">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Directions"
                        title="Directions"
                    >
                        <Navigation />
                        <span className="max-[399px]:hidden">Directions</span>
                    </a>
                </Button>
            )}
            <SaveButton school={school} />
            <ShareButton school={school} />
        </div>
    );
}
