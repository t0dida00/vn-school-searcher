import Link from "next/link";
import { Map as MapIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import LostStudentArt from "./components/LostStudentArt";
import { countryPath, DEFAULT_COUNTRY } from "./lib/countries";

export const metadata = { title: "Page not found · FinUnies" };

// Night sky over Finland: black into teal, with a soft aurora and a few stars
const STARS = [
    [8, 12], [18, 30], [27, 8], [38, 22], [62, 10], [71, 28], [83, 14], [92, 34], [12, 48], [88, 52], [50, 4], [56, 36],
];

export default function NotFound() {
    return (
        <main className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-[linear-gradient(180deg,#000_0%,#03141a_38%,#1d5566_75%,#3f8fa8_100%)] px-4 pb-6 pt-14 text-center text-white sm:pt-20">
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -left-1/4 top-[18%] h-48 w-[150%] -rotate-6 rounded-[100%] bg-[radial-gradient(closest-side,rgba(52,211,153,0.28),transparent)] blur-2xl" />
                <div className="absolute -right-1/4 top-[28%] h-40 w-[120%] rotate-3 rounded-[100%] bg-[radial-gradient(closest-side,rgba(56,189,248,0.2),transparent)] blur-2xl" />
                {STARS.map(([x, y], i) => (
                    <span
                        key={i}
                        className="absolute size-0.5 rounded-full bg-white motion-safe:animate-pulse"
                        style={{ left: `${x}%`, top: `${y}%`, opacity: 0.4 + (i % 3) * 0.2, animationDelay: `${i * 0.4}s` }}
                    />
                ))}
            </div>

            <div className="relative flex w-full max-w-xl flex-col items-center">
                <p className="mb-3 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs tracking-widest text-white/70">ERROR 404</p>
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">Oops!</h1>
                <p className="mt-4 max-w-md text-white/70 sm:text-lg">
                    The page you&apos;re looking for has moved or doesn&apos;t exist. Even the best students get lost sometimes.
                </p>
                <div className="mt-7 flex w-full flex-col gap-2 min-[360px]:w-auto min-[360px]:flex-row">
                    <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                        <Link href={countryPath(DEFAULT_COUNTRY, "/university-list")}>
                            <Search />
                            Browse schools
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">
                        <Link href={countryPath(DEFAULT_COUNTRY, "/map")}>
                            <MapIcon />
                            Open the map
                        </Link>
                    </Button>
                </div>
            </div>

            <LostStudentArt className="relative mt-6 w-full max-w-2xl sm:mt-8" />
        </main>
    );
}
