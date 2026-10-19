"use client";
import dynamic from "next/dynamic";
import type { GlobeCountry } from "./GlobeMap";

// mapbox-gl needs `window`, so the globe only renders on the client (like MapWrapper)
const GlobeMap = dynamic(() => import("./GlobeMap"), {
    ssr: false,
    loading: () => <div className="size-full animate-pulse bg-[radial-gradient(circle_at_50%_55%,#1e3a5f_0%,#0b1026_60%)]" aria-hidden />,
});

export default function GlobeMapLoader({ countries, className }: { countries: GlobeCountry[]; className?: string }) {
    return (
        <div className={className}>
            <GlobeMap countries={countries} className="size-full" />
        </div>
    );
}
