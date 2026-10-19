"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { schoolId } from "../utils/schoolId";
import styles from "./styles/hero.module.scss";

// The endless strip of school logos, shared by the country hero and the landing page

// Decorative only: the strip just shows the schools, it doesn't open them
function LogoTile({ school }: { school: any }) {
    const { name, logo } = school.properties || {};
    const [failed, setFailed] = useState(false);

    return (
        <div title={name} className="flex h-16 w-32 shrink-0 select-none items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 sm:h-20 sm:w-40">
            {logo && !failed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={name ?? ""} loading="lazy" draggable={false} className="max-h-full max-w-full object-contain" onError={() => setFailed(true)} />
            ) : (
                <span className="line-clamp-2 text-xs font-semibold text-slate-600">{name}</span>
            )}
        </div>
    );
}

// Seconds per logo: a slow drift, roughly 25px/s whatever the row length
const SECONDS_PER_TILE = 7;

export function MarqueeRow({ schools, reverse }: { schools: any[]; reverse?: boolean }) {
    return (
        <div className={styles.marquee} style={{ "--duration": `${Math.max(schools.length, 8) * SECONDS_PER_TILE}s` } as React.CSSProperties}>
            <div className={cn(styles.track, reverse && styles.reverse)}>
                <div className={styles.group}>
                    {schools.map((s) => (
                        <LogoTile key={schoolId(s)} school={s} />
                    ))}
                </div>
                {/* Second copy makes the loop seamless; hidden from assistive tech */}
                <div className={styles.group} aria-hidden>
                    {schools.map((s) => (
                        <LogoTile key={schoolId(s)} school={s} />
                    ))}
                </div>
            </div>
        </div>
    );
}
