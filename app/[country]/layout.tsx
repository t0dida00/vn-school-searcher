import React from "react";
import { notFound } from "next/navigation";
import { COUNTRY_CODES, isCountry } from "../lib/countries";

// Only the listed countries exist; anything else (e.g. /xx/map) is a 404
export const dynamicParams = false;

export function generateStaticParams() {
    return COUNTRY_CODES.map((country) => ({ country }));
}

export default async function CountryLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ country: string }>;
}) {
    if (!isCountry((await params).country)) notFound();
    return children;
}
