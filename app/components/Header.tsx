"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCountryPath } from "../utils/useCountry";

const NAV_LINKS = [
    { href: "/university-list", label: "Universities" },
    { href: "/map", label: "Map" },
];

export default function Header({ fullWidth = false }: { fullWidth?: boolean }) {
    const route = usePathname();
    const path = useCountryPath();

    return (
        <header className="w-full border-b">
            <div className={cn("mx-auto flex items-center justify-between px-4 py-2", fullWidth ? "max-w-none" : "max-w-6xl")}>
                <Link href={path("/university-list")} className="flex items-center">
                    <Image src="/logo.png" alt="FinUnies" width={64} height={64} className="size-14 object-contain sm:size-16 [@media(max-height:500px)]:size-10" priority />
                </Link>
                <nav className="flex items-center gap-1 text-sm">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = route === path(href);
                        return (
                            <Link
                                key={href}
                                href={path(href)}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "rounded-md px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground",
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
