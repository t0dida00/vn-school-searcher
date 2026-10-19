"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { href: "/school-list", label: "Schools" },
    { href: "/map", label: "Map" },
];

export default function Header({ fullWidth = false }: { fullWidth?: boolean }) {
    const route = usePathname();

    return (
        <header className="w-full border-b">
            <div className={cn("mx-auto flex items-center justify-between px-4 py-2", fullWidth ? "max-w-none" : "max-w-6xl")}>
                <Link href="/school-list" className="flex items-center">
                    <Image src="/logo.png" alt="FinUnies" width={64} height={64} className="size-14 object-contain sm:size-16 [@media(max-height:500px)]:size-10" priority />
                </Link>
                <nav className="flex items-center gap-1 text-sm">
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={route === href ? "page" : undefined}
                            className={cn(
                                "rounded-md px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground",
                                route === href && "bg-muted text-foreground"
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
