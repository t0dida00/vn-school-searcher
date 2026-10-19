import React from "react";

// Original illustration for the 404 page: a lost student on a stack of books, a "404" signpost
// a reindeer in a Finnish-flag scarf and a Finnish flag on a pole. Pure SVG so it scales crisply and needs no asset.
const SKIN = "#f1c7a0";
const SKIN_SHADE = "#dba67c";
const HOODIE = "#ff7a59";
const HOODIE_SHADE = "#e3603f";
const PANTS = "#2c3e66";
const INK = "#1f2430";
const GOLD = "#f2c94c";
const PAPER = "#fbf5e6";
const PAPER_SHADE = "#ecdfc0";
const FUR = "#a47551";
const FUR_LIGHT = "#d2a982";
const ANTLER = "#ecd9b6";

function Book({ x, y, w, h, color, spine }: { x: number; y: number; w: number; h: number; color: string; spine: string }) {
    return (
        <g>
            <rect x={x} y={y} width={w} height={h} rx={6} fill={color} />
            {/* Page edges on the right, spine on the left */}
            <rect x={x + 14} y={y + 6} width={w - 18} height={h - 12} rx={3} fill={PAPER} />
            {[0.3, 0.5, 0.7].map((t) => (
                <line key={t} x1={x + 18} x2={x + w - 8} y1={y + 6 + (h - 12) * t} y2={y + 6 + (h - 12) * t} stroke={PAPER_SHADE} strokeWidth={1.5} />
            ))}
            <rect x={x} y={y} width={16} height={h} rx={6} fill={spine} />
            <rect x={x + 4} y={y + h * 0.3} width={8} height={3} rx={1.5} fill={GOLD} opacity={0.9} />
            <rect x={x + 4} y={y + h * 0.6} width={8} height={3} rx={1.5} fill={GOLD} opacity={0.9} />
        </g>
    );
}

function Pine({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x={-4} y={-6} width={8} height={18} fill="#0b2a33" />
            <path d="M0 -110 L26 -66 L14 -66 L36 -32 L20 -32 L44 0 L-44 0 L-20 -32 L-36 -32 L-14 -66 L-26 -66 Z" fill={color} />
            {/* Snow on the tiers */}
            <path d="M0 -110 L10 -92 L4 -94 L0 -88 L-4 -94 L-10 -92 Z" fill="#e8f4f8" opacity={0.85} />
            <path d="M-14 -66 L-20 -58 L-12 -60 L-6 -54 L0 -60 L6 -54 L12 -60 L20 -58 L14 -66 Z" fill="#e8f4f8" opacity={0.6} />
        </g>
    );
}

export default function LostStudentArt({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 640 400" className={className} role="img" aria-labelledby="lost-art-title">
            <title id="lost-art-title">A puzzled student sitting on a stack of books, reading a map next to a 404 signpost, a reindeer and a Finnish flag</title>
            <defs>
                <radialGradient id="lost-ground" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#000" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#000" stopOpacity={0} />
                </radialGradient>
                {/* Wavy outline for the flag, in flag-local coordinates (72 × 44, Finnish 18:11) */}
                <clipPath id="lost-flag-wave">
                    <path d="M0 0 Q18 -5 36 0 T72 0 V44 Q54 49 36 44 T0 44 Z" />
                </clipPath>
                <linearGradient id="lost-flag-shade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#000" stopOpacity={0} />
                    <stop offset="25%" stopColor="#000" stopOpacity={0.12} />
                    <stop offset="50%" stopColor="#000" stopOpacity={0} />
                    <stop offset="75%" stopColor="#000" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#000" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lost-snow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e9f5f9" />
                    <stop offset="100%" stopColor="#b9dbe6" />
                </linearGradient>
            </defs>

            {/* Background pines */}
            <Pine x={70} y={350} s={1.1} color="#123f4b" />
            <Pine x={44} y={360} s={0.75} color="#0f3540" />
            <Pine x={570} y={350} s={1.2} color="#123f4b" />
            <Pine x={606} y={362} s={0.8} color="#0f3540" />

            {/* Flagpole with the Finnish flag, behind the reindeer */}
            <g>
                <ellipse cx={548.5} cy={352} rx={14} ry={4} fill="#e9f5f9" opacity={0.6} />
                <rect x={546} y={40} width={5} height={312} rx={2} fill="#cfd8dc" />
                <rect x={546} y={40} width={2} height={312} fill="#fff" opacity={0.6} />
                <circle cx={548.5} cy={37} r={5} fill={GOLD} />
                <g transform="translate(551 48)">
                    <g clipPath="url(#lost-flag-wave)">
                        <rect x={0} y={-6} width={72} height={56} fill="#fff" />
                        {/* Nordic cross: vertical bar at 5/18–8/18, horizontal at 4/11–7/11 */}
                        <rect x={20} y={-6} width={12} height={56} fill="#003580" />
                        <rect x={0} y={16} width={72} height={12} fill="#003580" />
                        <rect x={0} y={-6} width={72} height={56} fill="url(#lost-flag-shade)" />
                    </g>
                </g>
            </g>

            {/* Snowy ground and soft shadow */}
            <ellipse cx={320} cy={362} rx={300} ry={34} fill="url(#lost-snow)" opacity={0.18} />
            <ellipse cx={320} cy={352} rx={230} ry={22} fill="url(#lost-ground)" />

            {/* Signpost */}
            <g>
                <rect x={128} y={150} width={11} height={205} rx={3} fill="#8d6e4e" />
                <rect x={128} y={150} width={4} height={205} fill="#a5835f" />
                <ellipse cx={133.5} cy={150} rx={9} ry={4} fill="#e9f5f9" />
                <g transform="rotate(-4 133 172)">
                    <path d="M96 158 H186 L200 172 L186 186 H96 Z" fill={GOLD} />
                    <text x={146} y={179} textAnchor="middle" fontSize={17} fontWeight={800} fill={INK} letterSpacing={1}>404</text>
                </g>
                <g transform="rotate(5 133 212)">
                    <path d="M170 198 H80 L66 212 L80 226 H170 Z" fill="#eb5757" />
                    <text x={120} y={217} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">Campus?</text>
                </g>
                <g transform="rotate(-9 133 250)">
                    <path d="M98 238 H178 L190 250 L178 262 H98 Z" fill="#56ccf2" />
                    <text x={142} y={255} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>???</text>
                </g>
            </g>

            {/* Backpack leaning on the books */}
            <g>
                <rect x={176} y={308} width={38} height={46} rx={12} fill="#7c5cd6" />
                <rect x={182} y={300} width={26} height={22} rx={10} fill="#6847c2" />
                <rect x={183} y={330} width={24} height={16} rx={5} fill="#6847c2" />
                <circle cx={195} cy={338} r={2} fill={GOLD} />
                <path d="M186 304 Q195 290 204 304" stroke="#4e33a0" strokeWidth={3} fill="none" />
            </g>

            {/* Stack of books */}
            <Book x={205} y={306} w={232} h={46} color="#2f80ed" spine="#1f63c6" />
            <Book x={220} y={266} w={204} h={42} color="#f2994a" spine="#d87a2c" />
            <Book x={232} y={230} w={182} h={38} color="#27ae60" spine="#1e8c4d" />

            {/* Student */}
            <g>
                {/* Legs dangling over the front of the books; the right one mid-swing */}
                <g>
                    <rect x={281} y={224} width={19} height={84} rx={9} fill={PANTS} />
                    <rect x={281} y={292} width={19} height={8} fill="#fff" opacity={0.9} />
                    <ellipse cx={288} cy={308} rx={15} ry={8} fill="#f5f5f5" />
                    <path d="M273 311 H303" stroke="#c9ccd1" strokeWidth={3} strokeLinecap="round" />
                </g>
                <g transform="rotate(-14 313 228)">
                    <rect x={303} y={224} width={19} height={84} rx={9} fill={PANTS} />
                    <rect x={303} y={292} width={19} height={8} fill="#fff" opacity={0.9} />
                    <ellipse cx={316} cy={308} rx={15} ry={8} fill="#f5f5f5" />
                    <path d="M301 311 H331" stroke="#c9ccd1" strokeWidth={3} strokeLinecap="round" />
                </g>

                {/* Torso (hoodie) */}
                <path d="M268 176 Q270 160 286 158 H314 Q330 160 332 176 L328 232 Q300 240 272 232 Z" fill={HOODIE} />
                <path d="M286 158 Q300 172 314 158" fill="none" stroke={HOODIE_SHADE} strokeWidth={4} strokeLinecap="round" />
                <path d="M294 166 V182 M306 166 V182" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.8} />

                {/* Neck and head */}
                <rect x={293} y={146} width={14} height={14} rx={5} fill={SKIN_SHADE} />
                <circle cx={276} cy={130} r={5.5} fill={SKIN_SHADE} />
                <circle cx={324} cy={130} r={5.5} fill={SKIN_SHADE} />
                <circle cx={300} cy={128} r={24} fill={SKIN} />
                {/* Hair peeking out under the cap */}
                <path d="M277 122 Q279 104 300 103 Q321 104 323 122 Q314 113 300 114 Q286 113 277 122 Z" fill="#3b2a20" />
                {/* Glasses, raised brow, little "o" of confusion */}
                <circle cx={291} cy={129} r={7} fill="#fff" fillOpacity={0.35} stroke={INK} strokeWidth={2.5} />
                <circle cx={309} cy={129} r={7} fill="#fff" fillOpacity={0.35} stroke={INK} strokeWidth={2.5} />
                <path d="M298 129 H302" stroke={INK} strokeWidth={2.5} />
                <circle cx={292} cy={130} r={2} fill={INK} />
                <circle cx={310} cy={130} r={2} fill={INK} />
                <path d="M285 117 Q291 113 297 116" stroke="#3b2a20" strokeWidth={2.5} fill="none" strokeLinecap="round" />
                <path d="M304 118 Q309 117 315 119" stroke="#3b2a20" strokeWidth={2.5} fill="none" strokeLinecap="round" />
                <ellipse cx={300} cy={143} rx={3} ry={3.6} fill="#8a4b3a" />
                <circle cx={283} cy={139} r={4} fill="#ff9d8a" opacity={0.5} />
                <circle cx={317} cy={139} r={4} fill="#ff9d8a" opacity={0.5} />

                {/* Graduation cap */}
                <path d="M283 108 H317 V116 Q300 121 283 116 Z" fill="#2b3142" />
                <path d="M260 104 L300 90 L340 104 L300 118 Z" fill={INK} />
                <path d="M260 104 L300 118 L340 104 L340 106 L300 120 L260 106 Z" fill="#11141c" />
                <circle cx={300} cy={104} r={2.5} fill={GOLD} />
                <path d="M300 104 Q322 104 333 110 V124" stroke={GOLD} strokeWidth={2} fill="none" strokeLinecap="round" />
                <rect x={330} y={122} width={6} height={10} rx={2} fill={GOLD} />

                {/* Unfolded map held in both hands */}
                <g>
                    <path d="M252 178 L274 172 L300 180 L326 172 L348 178 L348 214 L326 208 L300 216 L274 208 L252 214 Z" fill={PAPER} />
                    <path d="M274 172 L300 180 L300 216 L274 208 Z" fill={PAPER_SHADE} />
                    <path d="M326 172 L348 178 L348 214 L326 208 Z" fill={PAPER_SHADE} />
                    <path d="M262 204 Q276 186 292 198 T322 190 T340 188" stroke="#eb5757" strokeWidth={2} strokeDasharray="4 4" fill="none" strokeLinecap="round" />
                    <path d="M260 186 Q266 182 270 190" stroke="#56ccf2" strokeWidth={3} fill="none" opacity={0.7} />
                    <circle cx={340} cy={186} r={5} fill="#eb5757" />
                    <circle cx={340} cy={186} r={2} fill="#fff" />
                </g>
                {/* Sleeves and hands over the map edges */}
                <path d="M272 170 Q258 176 254 192" stroke={HOODIE} strokeWidth={15} strokeLinecap="round" fill="none" />
                <path d="M328 170 Q342 176 346 192" stroke={HOODIE} strokeWidth={15} strokeLinecap="round" fill="none" />
                <circle cx={253} cy={196} r={8} fill={SKIN} />
                <circle cx={347} cy={196} r={8} fill={SKIN} />
            </g>

            {/* Floating question marks */}
            <g className="motion-safe:animate-bounce" style={{ transformBox: "fill-box", animationDuration: "2.4s" }}>
                <circle cx={360} cy={72} r={15} fill="#fff" opacity={0.95} />
                <text x={360} y={79} textAnchor="middle" fontSize={20} fontWeight={800} fill={INK}>?</text>
                <circle cx={344} cy={94} r={4} fill="#fff" opacity={0.8} />
                <circle cx={336} cy={104} r={2.5} fill="#fff" opacity={0.6} />
            </g>

            {/* Reindeer friend in a Finnish-flag scarf */}
            <g>
                <ellipse cx={510} cy={354} rx={58} ry={8} fill="#000" opacity={0.25} />
                {/* Back legs, body, front legs */}
                <rect x={528} y={308} width={9} height={44} rx={4} fill="#8a5f3f" />
                <rect x={480} y={308} width={9} height={44} rx={4} fill="#8a5f3f" />
                <ellipse cx={512} cy={300} rx={46} ry={27} fill={FUR} />
                <ellipse cx={510} cy={312} rx={32} ry={12} fill={FUR_LIGHT} opacity={0.7} />
                <rect x={542} y={310} width={10} height={44} rx={4} fill={FUR} />
                <rect x={492} y={312} width={10} height={42} rx={4} fill={FUR} />
                {[536, 484, 546, 496].map((x) => (
                    <rect key={x} x={x} y={346} width={x === 546 || x === 496 ? 11 : 10} height={7} rx={2.5} fill="#3b2a20" />
                ))}
                <path d="M556 290 Q568 284 566 296" stroke={FUR_LIGHT} strokeWidth={6} strokeLinecap="round" fill="none" />
                {/* Neck and head, turned toward the student */}
                <path d="M478 296 Q466 270 470 248 L492 246 Q494 272 504 288 Z" fill={FUR} />
                <ellipse cx={472} cy={238} rx={21} ry={17} fill={FUR} />
                <ellipse cx={455} cy={246} rx={13} ry={10} fill={FUR_LIGHT} />
                <ellipse cx={447} cy={243} rx={5} ry={4} fill="#3b2a20" />
                <circle cx={470} cy={232} r={3} fill={INK} />
                <circle cx={471} cy={231} r={1} fill="#fff" />
                <path d="M452 252 Q457 255 462 252" stroke="#6b4a33" strokeWidth={1.8} fill="none" strokeLinecap="round" />
                <ellipse cx={490} cy={228} rx={9} ry={5} transform="rotate(-25 490 228)" fill={FUR} />
                <ellipse cx={490} cy={228} rx={5} ry={2.5} transform="rotate(-25 490 228)" fill={FUR_LIGHT} />
                {/* Antlers */}
                <path d="M470 222 Q466 200 452 190 M462 205 Q452 204 446 196 M466 196 Q470 186 466 178" stroke={ANTLER} strokeWidth={5} strokeLinecap="round" fill="none" />
                <path d="M482 222 Q490 200 504 190 M494 204 Q504 202 510 194 M490 196 Q488 186 494 178" stroke={ANTLER} strokeWidth={5} strokeLinecap="round" fill="none" />
                {/* Scarf: white with a blue band */}
                <path d="M468 262 Q484 270 500 262 L502 276 Q484 284 466 276 Z" fill="#fff" />
                <path d="M467 268 Q484 276 501 268 L501.5 272 Q484 280 466.5 272 Z" fill="#2f6fd6" />
                <path d="M494 272 L506 300 L496 302 L488 276 Z" fill="#fff" />
                <path d="M497 280 L501 290 L497 291 Z" fill="#2f6fd6" />
            </g>
        </svg>
    );
}
