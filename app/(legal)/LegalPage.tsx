import React from "react";
import { CONTACT_EMAIL } from "../lib/contact";

// Shared shell for the policy pages: title, last-updated date and readable prose
export default function LegalPage({ title, updated, intro, children }: { title: string; updated: string; intro: React.ReactNode; children: React.ReactNode }) {
    return (
        <main className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:pt-14">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>
            <p className="mt-6 text-base leading-relaxed text-foreground/90">{intro}</p>
            <div className="mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-foreground/85 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:mt-1.5 [&_p+p]:mt-3 [&_p+ul]:mt-2 [&_ul+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
                {children}
            </div>
        </main>
    );
}

export function ContactLink({ subject }: { subject: string }) {
    return <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`}>{CONTACT_EMAIL}</a>;
}
