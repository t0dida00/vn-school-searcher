import React from "react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full  text-black mt-5''">
            <div className="max-w-[768px] mx-auto px-4 py-4 flex items-center justify-center">

                <nav className="hidden sm:flex gap-4 items-center text-sm">
                    <Link href="/school-list" className="hover:underline ">
                        Home
                    </Link>
                    <Link href="/map" className="hover:underline ">
                        Map View
                    </Link>
                    <Link href="/trac-nghiem" className="hover:underline ">
                        Blog
                    </Link>

                </nav>
            </div>
        </header>
    );
}
