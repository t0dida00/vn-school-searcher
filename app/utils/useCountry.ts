"use client";
import { useParams } from "next/navigation";
import { countryPath, DEFAULT_COUNTRY, isCountry, type CountryCode } from "../lib/countries";

// The country from the /[country]/... URL; the default outside those routes (e.g. the 404 page)
export function useCountry(): CountryCode {
    const { country } = useParams<{ country?: string }>();
    return isCountry(country) ? country : DEFAULT_COUNTRY;
}

// Prefixes app paths with the current country: path("/map") → "/fi/map"
export function useCountryPath() {
    const country = useCountry();
    return (path: string) => countryPath(country, path);
}
