"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCountryConfig, useCountryPath } from "../utils/useCountry";
import CountrySwitcher from "./CountrySwitcher";
import UniesMark from "./landing/UniesMark";

const NAV_LINKS = [
    { href: "/university-list", label: "Universities" },
    { href: "/map", label: "Map", needsMap: true },
];

export default function Header({ fullWidth = false }: { fullWidth?: boolean }) {
    const route = usePathname();
    const path = useCountryPath();
    const { hasMap } = useCountryConfig();

    return (
        <header className="w-full border-b">
            <div className={cn("mx-auto flex items-center justify-between px-4 py-2", fullWidth ? "max-w-none" : "max-w-6xl")}>
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* The site-wide Unies mark, home to the landing page; the switcher names the country */}
                    <Link href="/" aria-label="Unies home" className="flex items-center rounded-sm py-1 text-[#191919] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#191919] [@media(max-height:500px)]:py-0">
                        <UniesMark />
                    </Link>
                    <CountrySwitcher />
                </div>
                <nav className="flex items-center gap-1 text-sm">
                    {NAV_LINKS.filter((link) => hasMap || !link.needsMap).map(({ href, label }) => {
                        const active = route === path(href);
                        return (
                            <Link
                                key={href}
                                href={path(href)}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "rounded-md px-3 py-1.5 font-medium text-muted-foreground max-[359px]:px-2 transition-colors hover:text-foreground",
                                    active && "bg-black text-white hover:text-white"
                                )}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
