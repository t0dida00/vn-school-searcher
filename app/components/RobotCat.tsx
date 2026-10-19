"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./styles/robotCat.module.scss";

// The footer's mascot: a little robot cat in a white glossy helmet with a visor face, wearing the Unies
// mortarboard. It walks along the footer's ground line to wherever the pointer is (a tap on touch screens),
// sits there blinking and swishing its tail, and watches the pointer; a click (or Enter) makes it hop, wave
// and send a heart. It pauses off screen and stays still under reduced motion.

const CAT_WIDTH = 84;
const SPEED = 150; // walking speed toward the pointer, px per second

function CatSvg({ happy }: { happy: boolean }) {
    // useId has colons, which break url(#...) references
    const uid = useId().replace(/:/g, "");
    const id = (name: string) => `${name}-${uid}`;
    const part = (cls: string) => `${styles.part} ${cls}`;

    return (
        <svg viewBox="0 0 120 132" width={CAT_WIDTH} height={(CAT_WIDTH * 132) / 120} className={styles.cat} aria-hidden>
            <defs>
                <radialGradient id={id("shell")} cx="35%" cy="25%" r="85%">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset="0.6" stopColor="#F1F2F8" />
                    <stop offset="1" stopColor="#C9CDE0" />
                </radialGradient>
                <linearGradient id={id("visor")} x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0" stopColor="#4338CA" />
                    <stop offset="1" stopColor="#1E1B4B" />
                </linearGradient>
                <linearGradient id={id("body")} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#4C4AA6" />
                    <stop offset="1" stopColor="#1F1D57" />
                </linearGradient>
                <linearGradient id={id("pod")} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#C084FC" />
                    <stop offset="1" stopColor="#E879C9" />
                </linearGradient>
                <filter id={id("glow")} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Ground shadow, stays put while the cat hops */}
            <ellipse cx="60" cy="128" rx="30" ry="4" fill="#191919" opacity="0.14" />

            <g className={part(styles.hop)}>
                <g className={part(styles.body)}>
                    {/* Tail, swishing from its base */}
                    <path className={part(styles.tail)} d="M78 114 C100 114 108 94 99 80" fill="none" stroke={`url(#${id("body")})`} strokeWidth="7" strokeLinecap="round" />
                    {/* Legs with white paws */}
                    <g className={part(styles.legL)}>
                        <rect x="44" y="110" width="12" height="17" rx="6" fill="#26246A" />
                        <ellipse cx="50" cy="125" rx="6" ry="3" fill="#F1F2F8" />
                    </g>
                    <g className={part(styles.legR)}>
                        <rect x="64" y="110" width="12" height="17" rx="6" fill="#26246A" />
                        <ellipse cx="70" cy="125" rx="6" ry="3" fill="#F1F2F8" />
                    </g>
                    {/* Body with a heart-light on the chest */}
                    <rect x="40" y="84" width="40" height="34" rx="16" fill={`url(#${id("body")})`} />
                    <circle cx="60" cy="99" r="3" fill="#8BE3FF" filter={`url(#${id("glow")})`} />
                    {/* Arms; the right one waves when happy */}
                    <rect x="33" y="88" width="9" height="20" rx="4.5" fill="#2E2C7A" />
                    <g className={part(styles.armR)}>
                        <rect x="78" y="88" width="9" height="20" rx="4.5" fill="#2E2C7A" />
                        <circle cx="82.5" cy="106" r="4.5" fill="#F1F2F8" />
                    </g>

                    <g className={part(styles.head)}>
                        {/* Ears: white shells, pink inside; the left one twitches */}
                        <g className={part(styles.earL)}>
                            <path d="M28 40 L32 9 Q34 4 39 7 L56 26 Z" fill={`url(#${id("shell")})`} stroke="#C9CDE0" strokeWidth="0.8" />
                            <path d="M34 32 L36 15 L48 26 Z" fill="#F5A3D3" />
                        </g>
                        <path d="M92 40 L88 9 Q86 4 81 7 L64 26 Z" fill={`url(#${id("shell")})`} stroke="#C9CDE0" strokeWidth="0.8" />
                        <path d="M86 32 L84 15 L72 26 Z" fill="#F5A3D3" />
                        {/* Earpods */}
                        <rect x="13" y="44" width="12" height="28" rx="6" fill={`url(#${id("pod")})`} />
                        <rect x="95" y="44" width="12" height="28" rx="6" fill={`url(#${id("pod")})`} />
                        {/* Helmet with a glossy highlight */}
                        <rect x="20" y="22" width="80" height="64" rx="28" fill={`url(#${id("shell")})`} stroke="#C9CDE0" strokeWidth="0.8" />
                        <ellipse cx="38" cy="31" rx="12" ry="4.5" fill="#FFFFFF" opacity="0.9" transform="rotate(-16 38 31)" />
                        {/* Visor face */}
                        <rect x="28" y="34" width="64" height="42" rx="18" fill={`url(#${id("visor")})`} />
                        <path d="M36 42 Q44 37 56 37" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.22" />
                        <g className={styles.look}>
                            {happy ? (
                                <g fill="none" stroke="#8BE3FF" strokeWidth="3" strokeLinecap="round" filter={`url(#${id("glow")})`}>
                                    <path d="M42 57 Q48 49 54 57" />
                                    <path d="M66 57 Q72 49 78 57" />
                                </g>
                            ) : (
                                <g className={part(styles.eyesBlink)} fill="#8BE3FF" filter={`url(#${id("glow")})`}>
                                    <rect x="44" y="46" width="8" height="14" rx="4" />
                                    <rect x="68" y="46" width="8" height="14" rx="4" />
                                </g>
                            )}
                            <path d="M55 66 Q57.5 69.5 60 66 Q62.5 69.5 65 66" fill="none" stroke="#8BE3FF" strokeWidth="1.6" strokeLinecap="round" />
                        </g>
                        {/* The Unies mortarboard, tilted, with a mustard tassel */}
                        <g transform="rotate(-8 60 16)">
                            <path d="M48 14 L48 22 Q60 27 72 22 L72 14 Z" fill="#191919" />
                            <path d="M60 4 L83 12 L60 20 L37 12 Z" fill="#191919" />
                            <path d="M60 12 L80 15 L80 25" fill="none" stroke="#E9A73A" strokeWidth="1.6" strokeLinecap="round" />
                            <rect x="77.8" y="24" width="4.4" height="6" rx="1.5" fill="#E9A73A" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
}

// Walks the cat along its stage toward the pointer (the parent must be position: relative, with the ground
// at its bottom edge). A frame loop moves it at walking speed and writes the transform directly, so following
// the mouse doesn't re-render React every frame; only walking/facing changes do.
export default function RobotCat() {
    const stageRef = useRef<HTMLDivElement>(null);
    const catRef = useRef<HTMLButtonElement>(null);
    const [ready, setReady] = useState(false);
    const [facing, setFacing] = useState<1 | -1>(-1);
    const [walking, setWalking] = useState(false);
    const [happy, setHappy] = useState(false);
    const [hearts, setHearts] = useState<number[]>([]);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const maxX = () => Math.max(0, stage.clientWidth - CAT_WIDTH);
        // Current position, where the pointer wants it, and the facing/walking last told to React. It starts at
        // the left end: pages float buttons over the bottom-right corner.
        let x = 0;
        let target: number | null = null;
        let shownFacing: 1 | -1 = -1;
        let shownWalking = false;
        let visible = false;
        let frame = 0;
        let last = 0;

        const place = () => {
            if (catRef.current) catRef.current.style.transform = `translateX(${x}px)`;
        };
        setReady(true);
        requestAnimationFrame(place);

        const tick = (now: number) => {
            frame = 0;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
            last = now;
            const goal = target === null ? x : Math.min(Math.max(target, 0), maxX());
            const dx = goal - x;
            const moving = Math.abs(dx) > 2;
            if (moving) {
                x += Math.sign(dx) * Math.min(Math.abs(dx), SPEED * dt);
                place();
                const dir: 1 | -1 = dx > 0 ? 1 : -1;
                if (dir !== shownFacing) setFacing((shownFacing = dir));
            }
            if (moving !== shownWalking) setWalking((shownWalking = moving));
            // Keep looping while there's somewhere to go; the next pointer move restarts it
            if (moving && visible) frame = requestAnimationFrame(tick);
            else last = 0;
        };
        const run = () => {
            if (!frame && visible && !still) frame = requestAnimationFrame(tick);
        };

        // The eyes look at the pointer
        const look = (clientX: number, clientY: number) => {
            const el = catRef.current;
            if (!el || still) return;
            const box = el.getBoundingClientRect();
            const dx = clientX - (box.left + box.width / 2);
            const dy = clientY - (box.top + box.height * 0.4);
            const dist = Math.hypot(dx, dy) || 1;
            const reach = Math.min(1, dist / 240);
            // The SVG is drawn facing left and mirrored to face right, so mirror the look too
            const flip = el.dataset.facing === "1" ? -1 : 1;
            el.style.setProperty("--look-x", `${((dx / dist) * 3.5 * reach * flip).toFixed(2)}px`);
            el.style.setProperty("--look-y", `${((dy / dist) * 2.5 * reach).toFixed(2)}px`);
        };

        // Mouse moves, and taps or drags on touch screens, set where it walks: under the pointer
        const onPointer = (e: PointerEvent) => {
            if (!visible) return;
            target = e.clientX - stage.getBoundingClientRect().left - CAT_WIDTH / 2;
            look(e.clientX, e.clientY);
            run();
        };

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) run();
        });
        io.observe(stage);
        // Stay inside the stage when it resizes
        const ro = new ResizeObserver(() => {
            x = Math.min(x, maxX());
            place();
        });
        ro.observe(stage);
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerdown", onPointer, { passive: true });
        return () => {
            io.disconnect();
            ro.disconnect();
            window.removeEventListener("pointermove", onPointer);
            window.removeEventListener("pointerdown", onPointer);
            cancelAnimationFrame(frame);
        };
    }, []);

    const pet = () => {
        setHappy(true);
        const key = Date.now();
        setHearts((h) => [...h, key]);
        setTimeout(() => setHearts((h) => h.filter((k) => k !== key)), 1400);
        setTimeout(() => setHappy(false), 1700);
    };

    return (
        <div ref={stageRef} className="pointer-events-none absolute inset-0">
            {ready && (
                <button
                    ref={catRef}
                    type="button"
                    onClick={pet}
                    data-facing={facing}
                    aria-label="Pet the Unies robot cat"
                    title="Pet me"
                    className={cn(
                        "pointer-events-auto absolute bottom-0 left-0 cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#191919]",
                        walking && styles.walking,
                        happy && styles.happy
                    )}
                >
                    {hearts.map((key) => (
                        <svg key={key} viewBox="0 0 24 22" width="18" height="16" className={styles.heart} aria-hidden>
                            <path d="M12 21 C5 15 1 11 1 6.5 A5.5 5.5 0 0 1 12 4 A5.5 5.5 0 0 1 23 6.5 C23 11 19 15 12 21 Z" fill="#F472B6" />
                        </svg>
                    ))}
                    {/* Mirrored to face the way it walks */}
                    <span className="block" style={{ transform: `scaleX(${facing === 1 ? -1 : 1})` }}>
                        <CatSvg happy={happy} />
                    </span>
                </button>
            )}
        </div>
    );
}
