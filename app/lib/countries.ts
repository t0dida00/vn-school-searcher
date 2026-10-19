// Countries the app has data for. Every page lives under /<code>/..., so adding a country means adding
// an entry here (plus its MongoDB collection); unknown codes 404 via app/[country]/layout.tsx.
export const COUNTRIES = {
    fi: { code: "fi", name: "Finland", collection: "fin_universities" },
} as const;

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
