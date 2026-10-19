// Countries the app has data for. Every page lives under /<code>/..., so adding a country means adding
// an entry here (plus its MongoDB collection, logo and public/filter-options/<code>.json); unknown codes
// 404 via app/[country]/layout.tsx.
export type Country = {
    code: string;
    name: string;
    // "Finnish universities", "any Vietnamese university"
    adjective: string;
    // MongoDB collection in schoolAPI
    collection: string;
    // Site name shown in the header logo, titles and copy
    brand: string;
    logo: string;
    // Whether app/map/countryMaps.ts has a map for this country (outline, bounds, cluster flag, loader
    // art); without one, /<code>/map 404s and map links are hidden
    hasMap: boolean;
    // Source of properties.ranking
    ranking: { source: string; url: string };
    hero: {
        // Rotating headline words: fields and cities from the data, ending on the catch-all
        words: string[];
        background: string;
        // Headline text-shadow tint, a darker shade of the background
        shadow: string;
        // Draw the hero as the country's flag. "cross": a Nordic cross, a `field` page with `background`
        // as the cross, its horizontal arm behind the headline. "star": a `background` field with a big
        // five-pointed star in `color` behind the headline (Vietnam), at `opacity` so white text stays readable
        flag?: { kind: "cross"; field: string } | { kind: "star"; color: string; opacity: number };
    };
};

export const COUNTRIES = {
    fi: {
        code: "fi",
        name: "Finland",
        adjective: "Finnish",
        collection: "fin_universities",
        brand: "FinUnies",
        logo: "/logo.png",
        hasMap: true,
        ranking: { source: "uniRank 2026 ranking in Finland", url: "https://www.unirank.org/fi/ranking/" },
        hero: {
            words: ["Universities.", "Engineering.", "Helsinki.", "Business.", "Tampere.", "Design.", "Oulu.", "Medicine.", "Turku.", "Everything."],
            // Finnish flag blue (PMS 294C) on white
            background: "#002f6c",
            shadow: "rgba(0,15,40,0.35)",
            flag: { kind: "cross", field: "#ffffff" },
        },
    },
    vn: {
        code: "vn",
        name: "Vietnam",
        adjective: "Vietnamese",
        collection: "vn_universities",
        brand: "VieUnies",
        logo: "/logo-vn.png",
        hasMap: true,
        ranking: { source: "uniRank 2026 ranking in Vietnam", url: "https://www.unirank.org/vn/ranking/" },
        hero: {
            // Short city names: "Ho Chi Minh City." wouldn't fit a 280px screen at headline size
            words: ["Universities.", "Hanoi.", "Engineering.", "Saigon.", "Economics.", "Da Nang.", "Medicine.", "Can Tho.", "Law.", "Everything."],
            // Vietnamese flag red and star yellow
            background: "#da251d",
            shadow: "rgba(110,10,5,0.3)",
            flag: { kind: "star", color: "#ffff00", opacity: 0.6 },
        },
    },
} as const satisfies Record<string, Country>;

export type CountryCode = keyof typeof COUNTRIES;

export const DEFAULT_COUNTRY: CountryCode = "fi";

export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

export function isCountry(code: string | null | undefined): code is CountryCode {
    return !!code && Object.prototype.hasOwnProperty.call(COUNTRIES, code);
}

// "/map" → "/fi/map"
export function countryPath(country: CountryCode, path: string) {
    return `/${country}${path}`;
}
