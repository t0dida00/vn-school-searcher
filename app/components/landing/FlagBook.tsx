"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { flagArt } from "../CountryFlag";
import type { Country } from "../../lib/countries";

// The logo's open book as a flip book: one flag per page, two per spread. It turns a page by itself every
// AUTOPLAY_MS (paused while hovered, focused, dragged or in a background tab; off for reduced motion). Drag or
// swipe a page across the spine to turn it yourself (it follows the finger, then completes or snaps back), or
// use the ←/→ keys. The supported countries (app/lib/countries.ts) come first, then other popular study
// destinations, up to TOTAL flags. On load the pages open from the spine and the logo's cap drops onto it.
const TOTAL = 10;
const AUTOPLAY_MS = 4000;

type Flag = { name: string; viewBox: string; shapes: React.ReactNode };

const tricolor = (name: string, colors: [string, string, string], vertical = false, viewBox = "0 0 3 2"): Flag => ({
    name,
    viewBox,
    shapes: colors.map((fill, i) => {
        const [, , w, h] = viewBox.split(" ").map(Number);
        return vertical ? <rect key={i} x={(w / 3) * i} width={w / 3} height={h} fill={fill} /> : <rect key={i} y={(h / 3) * i} width={w} height={h / 3} fill={fill} />;
    }),
});

// Nordic crosses: field, then (outer cross, inner cross) as [x, y, width] in flag units
const nordic = (name: string, viewBox: string, field: string, crosses: [string, number, number, number][]): Flag => {
    const [, , w, h] = viewBox.split(" ").map(Number);
    return {
        name,
        viewBox,
        shapes: (
            <>
                <rect width={w} height={h} fill={field} />
                {crosses.map(([fill, x, y, t]) => (
                    <React.Fragment key={fill + x}>
                        <rect x={x} width={t} height={h} fill={fill} />
                        <rect y={y} width={w} height={t} fill={fill} />
                    </React.Fragment>
                ))}
            </>
        ),
    };
};

// Other popular destinations, in their official proportions and colours
const MORE: Flag[] = [
    nordic("Sweden", "0 0 16 10", "#006AA7", [["#FECC00", 5, 4, 2]]),
    nordic("Norway", "0 0 22 16", "#BA0C2F", [["#FFFFFF", 6, 6, 4], ["#00205B", 7, 7, 2]]),
    nordic("Denmark", "0 0 37 28", "#C8102E", [["#FFFFFF", 12, 12, 4]]),
    tricolor("Estonia", ["#0072CE", "#000000", "#FFFFFF"], false, "0 0 33 21"),
    tricolor("Germany", ["#000000", "#DD0000", "#FFCE00"], false, "0 0 5 3"),
    tricolor("Netherlands", ["#AE1C28", "#FFFFFF", "#21468B"]),
    tricolor("France", ["#002395", "#FFFFFF", "#ED2939"], true),
    {
        name: "Japan",
        viewBox: "0 0 3 2",
        shapes: (
            <>
                <rect width="3" height="2" fill="#FFFFFF" />
                <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
            </>
        ),
    },
];

// Page and board outlines from the logo, split at the spine (x = 120)
const PAGE = {
    left: "M120 34 C96 22 52 18 16 24 L16 132 C52 126 96 130 120 142 Z",
    right: "M120 34 C144 22 188 18 224 24 L224 132 C188 126 144 130 120 142 Z",
};
const COVER = {
    left: "M120 44 C96 32 50 28 8 34 L8 142 C50 136 96 140 120 152 Z",
    right: "M120 44 C144 32 190 28 232 34 L232 142 C190 136 144 140 120 152 Z",
};
// Each half is its own SVG over half the book's 240 × 174 viewBox
const HALF_VIEWBOX = { left: "0 -14 120 174", right: "120 -14 120 174" };

function Page({ side, flag, board = true }: { side: "left" | "right"; flag?: Flag; board?: boolean }) {
    const clip = `flagbook-${side}`;
    return (
        <svg viewBox={HALF_VIEWBOX[side]} className="size-full" aria-hidden>
            <defs>
                <clipPath id={clip}>
                    <path d={PAGE[side]} />
                </clipPath>
            </defs>
            {board && <path d={COVER[side]} fill="#B7BCC2" />}
            <g clipPath={`url(#${clip})`}>
                <rect x={side === "left" ? 16 : 120} y="18" width="104" height="124" fill="#fff" />
                {flag && (
                    <svg x={side === "left" ? 16 : 120} y="18" width="104" height="124" viewBox={flag.viewBox} preserveAspectRatio="xMidYMid slice">
                        {flag.shapes}
                    </svg>
                )}
            </g>
            <path d={PAGE[side]} fill="none" stroke="#191919" strokeOpacity="0.18" strokeWidth="1" />
        </svg>
    );
}

// A page being turned: `dir` 1 turns the right page leftwards (next), -1 the left page rightwards (previous)
type Turn = { dir: 1 | -1; angle: number; animate: boolean };

export default function FlagBook({ countries, className }: { countries: Country[]; className?: string }) {
    const flags: Flag[] = [...countries.map((c) => ({ name: c.name, ...flagArt(c.hero) })), ...MORE].slice(0, TOTAL);
    const spreads = Math.ceil(flags.length / 2);
    const [spread, setSpread] = useState(0);
    const [turn, setTurn] = useState<Turn | null>(null);
    const bookRef = useRef<HTMLDivElement>(null);
    const drag = useRef<{ x: number; dir: 1 | -1 | 0 } | null>(null);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(false);

    const pageOf = (s: number, side: "left" | "right") => flags[((s + spreads) % spreads) * 2 + (side === "left" ? 0 : 1)];
    const target = turn ? (spread + turn.dir + spreads) % spreads : spread;

    const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Buttons, dots and keys: start a full turn from flat, one frame later, so the transition runs
    const turnTo = useCallback(
        (dir: 1 | -1) => {
            if (turn) return;
            if (reducedMotion()) return setSpread((s) => (s + dir + spreads) % spreads);
            setTurn({ dir, angle: 0, animate: false });
            requestAnimationFrame(() => requestAnimationFrame(() => setTurn({ dir, angle: 180, animate: true })));
        },
        [turn, spreads]
    );

    // A turn ends flat (cancelled) or fully over (the next spread becomes current)
    const settle = useCallback(
        (dir: 1 | -1, angle: number) => {
            if (angle >= 180) setSpread((s) => (s + dir + spreads) % spreads);
            setTurn(null);
        },
        [spreads]
    );
    const finish = () => {
        if (turn?.animate) settle(turn.dir, turn.angle);
    };
    // Safety net: if the transition never reports its end (e.g. the tab was hidden), settle anyway
    useEffect(() => {
        if (!turn?.animate) return;
        const t = setTimeout(() => settle(turn.dir, turn.angle), 800);
        return () => clearTimeout(t);
    }, [turn, settle]);

    // Drag: the page follows the pointer; past a third of the way (or a flick) it completes, otherwise it falls back
    const onPointerDown = (e: React.PointerEvent) => {
        if (turn) return;
        drag.current = { x: e.clientX, dir: 0 };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: React.PointerEvent) => {
        const d = drag.current;
        const width = bookRef.current?.clientWidth ?? 1;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (!d.dir) {
            if (Math.abs(dx) < 6) return;
            d.dir = dx < 0 ? 1 : -1;
        }
        const angle = Math.max(0, Math.min(180, ((d.dir === 1 ? -dx : dx) / (width / 2)) * 180));
        setTurn({ dir: d.dir, angle, animate: false });
    };
    const onPointerUp = () => {
        const d = drag.current;
        drag.current = null;
        if (!d?.dir) return;
        if (!turn) return;
        const to = turn.angle > 60 ? 180 : 0;
        // Already there (dragged all the way, or barely moved): nothing to animate, so no transitionend
        if (Math.abs(turn.angle - to) < 1) settle(turn.dir, to);
        else setTurn({ ...turn, angle: to, animate: true });
    };

    useEffect(() => {
        const el = bookRef.current;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") turnTo(1);
            if (e.key === "ArrowLeft") turnTo(-1);
        };
        el?.addEventListener("keydown", onKey);
        return () => el?.removeEventListener("keydown", onKey);
    }, [turnTo]);

    // Autoplay: one timer per spread, so any turn (automatic or by hand) restarts the count
    useEffect(() => {
        const onVisibility = () => setHidden(document.hidden);
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);
    useEffect(() => {
        if (turn || hovered || focused || hidden || reducedMotion()) return;
        const t = setTimeout(() => turnTo(1), AUTOPLAY_MS);
        return () => clearTimeout(t);
    }, [spread, turn, hovered, focused, hidden, turnTo]);

    // Under the turning page: the side it uncovers shows the next spread; the other side stays put
    const left = turn?.dir === -1 ? pageOf(target, "left") : pageOf(spread, "left");
    const right = turn?.dir === 1 ? pageOf(target, "right") : pageOf(spread, "right");
    const caption = [pageOf(spread, "left"), pageOf(spread, "right")].filter(Boolean).map((f) => f!.name).join(" · ");

    return (
        <div className={cn("select-none", className)} role="region" aria-roledescription="carousel" aria-label="Flags of study destinations">
            <style>{`
                @media (prefers-reduced-motion: no-preference) {
                    .flagbook-open { transform-origin: 50% 60%; animation: flagbook-open 0.9s cubic-bezier(.2,.7,.2,1) both; }
                    .flagbook-cap { animation: flagbook-cap 0.7s cubic-bezier(.3,1.4,.5,1) .75s both; }
                }
                @keyframes flagbook-open { from { transform: scaleX(0.08); } to { transform: scaleX(1); } }
                @keyframes flagbook-cap { from { transform: translateY(-46px) rotate(-8deg); opacity: 0; } to { transform: none; opacity: 1; } }
            `}</style>

            <div
                ref={bookRef}
                tabIndex={0}
                aria-label="Flip book. Drag a page, or use the left and right arrow keys."
                className="relative aspect-[240/174] cursor-grab touch-pan-y rounded-lg outline-none [perspective:1600px] focus-visible:ring-2 focus-visible:ring-[#191919]/40 active:cursor-grabbing"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                // Keyboard focus only: a mouse drag also focuses the book and shouldn't stop autoplay for good
                onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
                onBlur={() => setFocused(false)}
            >
                <div className="flagbook-open absolute inset-0">
                    <div className="absolute inset-y-0 left-0 w-1/2">
                        <Page side="left" flag={left} />
                    </div>
                    <div className="absolute inset-y-0 right-0 w-1/2">
                        <Page side="right" flag={right} />
                    </div>

                    {/* The turning page: front is the page lifting off, back is the page landing on the other side */}
                    {turn && (
                        <div
                            className="absolute inset-y-0 w-1/2 [transform-style:preserve-3d]"
                            style={{
                                left: turn.dir === 1 ? "50%" : 0,
                                transformOrigin: turn.dir === 1 ? "left center" : "right center",
                                transform: `rotateY(${turn.dir === 1 ? -turn.angle : turn.angle}deg)`,
                                transition: turn.animate ? "transform 0.55s cubic-bezier(.3,.7,.3,1)" : "none",
                            }}
                            onTransitionEnd={finish}
                        >
                            <div className="absolute inset-0 [backface-visibility:hidden]">
                                <Page side={turn.dir === 1 ? "right" : "left"} flag={pageOf(spread, turn.dir === 1 ? "right" : "left")} board={false} />
                                {/* Shade as the page lifts */}
                                <div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: Math.sin((turn.angle * Math.PI) / 180) * 0.18 }} />
                            </div>
                            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                <Page side={turn.dir === 1 ? "left" : "right"} flag={pageOf(target, turn.dir === 1 ? "left" : "right")} board={false} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Spine and the logo's mortarboard, above the pages */}
                <svg viewBox="0 -14 240 174" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
                    <path d="M120 34 L120 152" stroke="#191919" strokeOpacity="0.35" strokeWidth="1.5" />
                    <g className="flagbook-cap" style={{ transformOrigin: "120px 18px", transformBox: "view-box" }}>
                        <path d="M100 8 L100 22 Q120 32 140 22 L140 8 Z" fill="#191919" />
                        <path d="M120 -12 L164 2 L120 16 L76 2 Z" fill="#191919" />
                        <path d="M120 2 L156 6 L156 22" fill="none" stroke="#191919" strokeWidth="1.6" strokeLinecap="round" />
                        <rect x="153.5" y="21" width="5" height="9" rx="1.5" fill="#191919" />
                    </g>
                </svg>
            </div>

            {/* No visible controls: swipe or use the arrow keys. Screen readers still hear which flags are open */}
            <p aria-live="polite" className="sr-only">{caption}</p>
        </div>
    );
}
