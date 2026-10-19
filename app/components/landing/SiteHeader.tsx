import React from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import UniesMark from "./UniesMark";

// The overall header (not tied to one country, unlike app/components/Header): the Unies mark and a link to
// the country chooser, which lists however many countries there are
export default function SiteHeader() {
    return (
        <header className="border-b border-black/10 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
                <Link href="/" aria-label="Unies home" className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#191919]">
                    <UniesMark />
                </Link>
                <nav aria-label="Main">
                    <Link
                        href="/#countries"
                        className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium text-[#191919] transition-colors hover:bg-[#EEF0F2] focus-visible:outline-2 focus-visible:outline-[#191919]"
                    >
                        <Globe aria-hidden className="size-4" />
                        Countries
                    </Link>
                </nav>
            </div>
        </header>
    );
}
