"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, ExternalLink, GraduationCap, Mail, MapPin, Navigation, Phone, Share2, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stringToArray } from "@/app/utils/stringToArray";
import { schoolId } from "@/app/utils/schoolId";
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

/** Title block: rendered inside the dialog/drawer title so it's announced as the heading */
export function SchoolDetailHeader({ school, title }: { school: any; title: React.ReactNode }) {
    const { name, code, city, type, logo } = school?.properties || {};
    return (
        <div className="flex items-center gap-4 text-left">
            <Logo src={logo} name={name} code={code} />
            <div className="min-w-0">
                {title}
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

export function SchoolDetailBody({ school }: { school: any }) {
    const { overview, tuition, scholarship, fieldOptions, phone, email, address } = school?.properties || {};
    const fields = stringToArray(fieldOptions);
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
    const name = school?.properties?.name ?? "School";

    const share = async () => {
        const url = `${window.location.origin}/school/${schoolId(school)}`;
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

export function SchoolDetailActions({ school }: { school: any }) {
    const { website } = school?.properties || {};
    const coords = school?.geometry?.type === "Point" ? school.geometry.coordinates : null;
    return (
        <div className="flex gap-2">
            {website && (
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
