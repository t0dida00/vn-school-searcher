import React from "react";
import Link from "next/link";
import UniesMark from "./landing/UniesMark";
import RobotCat from "./RobotCat";
import { COUNTRIES, COUNTRY_CODES, countryPath } from "../lib/countries";
import { CONTACT_EMAIL } from "../lib/contact";

const LINK = "text-[#191919]/75 underline-offset-4 hover:text-[#191919] hover:underline";

// The copyright line with the policy and contact links: the compact footer on its own, and the bottom row
// of the full one
function BottomBar({ withLinks }: { withLinks: boolean }) {
    return (
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-xs text-[#191919]/60">
            <small className="text-xs">&copy; {new Date().getFullYear()} Khoa Dinh. All rights reserved.</small>
            {withLinks && (
                <nav aria-label="Legal" className="flex items-center gap-3 sm:ml-auto">
                    <Link href="/privacy" className={LINK}>Privacy</Link>
                    <Link href="/disclaimer" className={LINK}>Disclaimer</Link>
                    <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>Contact</a>
                </nav>
            )}
        </div>
    );
}

// The site-wide footer, the same on the landing page and every country page: what Unies is, every country
// (one list, so it grows with app/lib/countries.ts), help and policy pages, and where the data comes from.
// The robot cat mascot lives on the strip above the bottom row, whose top border is its ground.
// `compact` keeps only the bottom row (no cat), for the full-screen map.
export default function Footer({ compact = false }: { compact?: boolean }) {
    if (compact) {
        return (
            <footer className="border-t border-black/10 bg-[#EEF0F2]">
                <BottomBar withLinks />
            </footer>
        );
    }
    return (
        <footer className="border-t border-black/10 bg-[#EEF0F2] text-sm">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-4 pt-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]">
                <div className="max-w-xs">
                    <Link href="/" aria-label="Unies home" className="inline-block rounded-sm text-[#191919] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#191919]">
                        <UniesMark />
                    </Link>
                    <p className="mt-3 text-[#191919]/75">University search, country by country.</p>
                </div>
                <nav aria-label="Countries">
                    <h2 className="font-semibold text-[#191919]">Countries</h2>
                    <ul className="mt-2 flex flex-col gap-1.5">
                        {COUNTRY_CODES.map((code) => (
                            <li key={code}>
                                <Link className={LINK} href={countryPath(code, "/university-list")}>{COUNTRIES[code].name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <nav aria-label="Help">
                    <h2 className="font-semibold text-[#191919]">Help</h2>
                    <ul className="mt-2 flex flex-col gap-1.5">
                        <li><Link className={LINK} href="/#faq">Questions and answers</Link></li>
                    </ul>
                </nav>
                <div>
                    <h2 className="font-semibold text-[#191919]">Sources</h2>
                    <ul className="mt-2 flex flex-col gap-1.5 text-[#191919]/75">
                        <li>Rankings from <a className={LINK} href="https://www.unirank.org/" target="_blank" rel="noopener noreferrer">uniRank</a></li>
                        <li>Map data © <a className={LINK} href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors</li>
                    </ul>
                </div>
            </div>
            {/* The cat's stage: as tall as the cat, standing on the bottom row's border */}
            <div className="relative mx-auto h-[96px] max-w-7xl px-4">
                <div className="absolute inset-x-4 inset-y-0">
                    <RobotCat />
                </div>
            </div>
            <div className="border-t border-black/10">
                <BottomBar withLinks />
            </div>
        </footer>
    );
}
