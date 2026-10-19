import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// The site-wide logo, stacked like the original FinUnies / VieUnies logos: the cap-and-book from /logo.png
// (cropped above the country wordmark baked into the PNG) with "Unies" below it in the slab face.
// Multiply drops the PNG's white background on light surfaces.
export default function UniesMark({ className }: { className?: string }) {
    return (
        <span className={cn("flex w-max flex-col items-center gap-0.5", className)}>
            <span className="relative block h-[30px] w-[40px] shrink-0 overflow-hidden">
                <Image src="/logo.png" alt="" width={40} height={41} className="absolute left-0 top-0 h-[41px] w-[40px] max-w-none mix-blend-multiply" priority />
            </span>
            <span className="font-[family-name:var(--font-slab)] text-[15px] font-bold leading-none tracking-tight">Unies</span>
        </span>
    );
}
