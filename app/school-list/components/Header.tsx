"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function Header() {
    const route = usePathname();

    return (
        <header className="w-full  text-black mt-5''">
            <div className="max-w-[768px] mx-auto px-4 py-4 flex items-center justify-center">

                <nav className="hidden sm:flex gap-4 items-center text-sm">
                    <Link href="/school-list" className="hover:underline ">
                        {route === "/school-list" ? <Badge>Home</Badge> : "Home"}
                    </Link>
                    <Link href="/map" className="hover:underline ">
                        Map
                    </Link>
                    <Link href="/blog" className="hover:underline ">
                        {route === "/blog" ? <Badge>Blog</Badge> : "Blog"}
                    </Link>

                </nav>
            </div>
        </header>
    );
}
