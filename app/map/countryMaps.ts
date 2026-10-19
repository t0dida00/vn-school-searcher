// Per-country map pieces: the outline that masks the rest of the world, the bounds the camera is locked
// to, the flag drawn on clusters and the loader's paper-map art. Countries listed here need
// `hasMap: true` in app/lib/countries.ts.
import type { CountryCode } from "../lib/countries";

type Outline = GeoJSON.Feature<GeoJSON.MultiPolygon>;

export type CountryMap = {
    // [[west, south], [east, north]]
    bounds: [[number, number], [number, number]];
    // Loaded on demand so each map page only downloads its own country's outline
    loadOutline: () => Promise<Outline>;
    flag: {
        // Paints a round crop of the flag into a size × size canvas (already clipped to the circle)
        draw: (ctx: CanvasRenderingContext2D, size: number) => void;
        // Halo behind the cluster count, so it stays readable over the flag; also the globe badges' ring
        halo: string;
    };
    loader: {
        // Outline in Web Mercator, 200 units tall, and the university cities in the same units
        path: string;
        cities: { name: string; x: number; y: number }[];
        // Places the art on the 320 × 260 paper map, centred
        transform: string;
    };
};

export const COUNTRY_MAPS: Record<CountryCode, CountryMap> = {
    fi: {
        // Mainland Finland plus Åland
        bounds: [
            [19.0, 59.4],
            [31.6, 70.1],
        ],
        // Simplified Finland outline (incl. Åland) from geoBoundaries gbOpen FIN ADM0, OpenStreetMap data, ODbL 1.0
        loadOutline: () => import("./finland.json").then((m) => m.default as Outline),
        flag: {
            // 18:11, cross 3 units wide, vertical bar from 5 to 8, shifted so the bar sits a little left of
            // centre like on the real flag
            draw: (ctx, size) => {
                const unit = size / 11;
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = "#002f6c";
                ctx.fillRect(size * 0.4 - 1.5 * unit, 0, 3 * unit, size);
                ctx.fillRect(0, 4 * unit, size, 3 * unit);
            },
            halo: "#002f6c",
        },
        loader: {
            path: "M60 0 L48 3 L44 9 L42 25 L35 35 L27 29 L21 34 L15 32 L9 19 L4 20 L4 24 L0 24 L25 48 L23 58 L26 60 L24 65 L28 72 L25 84 L29 92 L38 97 L40 108 L39 112 L32 112 L25 127 L14 135 L15 140 L8 141 L9 145 L5 149 L9 171 L5 183 L8 189 L11 186 L9 189 L17 190 L16 193 L21 191 L19 194 L22 196 L18 197 L23 196 L19 200 L24 195 L23 198 L31 197 L42 191 L43 193 L44 189 L58 189 L90 147 L77 132 L81 126 L74 110 L75 96 L78 95 L69 70 L77 54 L66 43 L67 28 L64 27 L71 14 Z",
            cities: [
                { name: "Helsinki", x: 35.7, y: 194.1 },
                { name: "Tampere", x: 26.1, y: 171.9 },
                { name: "Joensuu", x: 74.9, y: 152.8 },
                { name: "Oulu", x: 40, y: 108.4 },
            ],
            transform: "translate(122 38) scale(0.85)",
        },
    },
    vn: {
        // Mainland Vietnam plus the coastal islands in the outline (Phú Quốc, Côn Đảo)
        bounds: [
            [102.1, 8.4],
            [109.5, 23.4],
        ],
        // Simplified Vietnam outline from geoBoundaries gbOpen VNM ADM0, CC BY 4.0
        loadOutline: () => import("./vietnam.json").then((m) => m.default as Outline),
        flag: {
            // Red field with the yellow five-pointed star; the star spans about 3/5 of the circle
            draw: (ctx, size) => {
                ctx.fillStyle = "#da251d";
                ctx.fillRect(0, 0, size, size);
                const c = size / 2;
                const outer = size * 0.3;
                const inner = outer * 0.382;
                ctx.beginPath();
                for (let i = 0; i < 10; i++) {
                    const r = i % 2 ? inner : outer;
                    const a = -Math.PI / 2 + (i * Math.PI) / 5;
                    ctx.lineTo(c + r * Math.cos(a), c + r * Math.sin(a));
                }
                ctx.closePath();
                ctx.fillStyle = "#ffcd00";
                ctx.fill();
            },
            halo: "#a3150f",
        },
        loader: {
            path: "M42 1 L41 0 L36 3 L35 6 L29 10 L25 8 L24 12 L20 9 L18 11 L15 8 L12 13 L5 9 L0 14 L7 24 L9 22 L11 23 L9 30 L12 35 L20 38 L26 34 L32 38 L29 42 L33 41 L32 44 L37 46 L32 52 L25 52 L25 54 L22 57 L40 66 L38 69 L43 72 L47 79 L54 84 L59 95 L61 94 L62 97 L69 101 L65 105 L71 109 L71 114 L69 115 L70 119 L67 127 L71 135 L70 150 L55 155 L56 159 L50 158 L47 160 L48 164 L52 167 L52 171 L48 170 L47 168 L41 170 L38 168 L38 172 L35 174 L30 176 L31 179 L33 178 L38 182 L35 185 L34 197 L36 197 L33 199 L35 200 L38 199 L44 193 L52 190 L54 187 L57 187 L60 176 L66 176 L88 164 L92 156 L91 149 L93 149 L91 146 L93 144 L95 146 L88 112 L79 102 L80 100 L78 100 L78 99 L66 90 L58 82 L55 73 L49 69 L45 61 L50 48 L57 44 L57 40 L60 38 L60 36 L67 34 L71 30 L70 30 L73 27 L75 28 L76 25 L68 25 L63 20 L59 20 L57 13 L61 8 L57 6 L48 6 Z",
            cities: [
                { name: "Hanoi", x: 47.7, y: 33 },
                { name: "Da Nang", x: 78.3, y: 100.8 },
                { name: "Ho Chi Minh City", x: 57.9, y: 170.3 },
                { name: "Can Tho", x: 46.5, y: 180.5 },
            ],
            transform: "translate(120 38) scale(0.85)",
        },
    },
};
