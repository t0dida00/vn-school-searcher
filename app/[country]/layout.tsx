import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COUNTRIES, COUNTRY_CODES, isCountry } from "../lib/countries";

// Only the listed countries exist; anything else (e.g. /xx/map) is a 404
export const dynamicParams = false;

export function generateStaticParams() {
    return COUNTRY_CODES.map((country) => ({ country }));
}

// Pages without their own title get the country's brand (VieUnies on /vn/...)
export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
    const { country } = await params;
    if (!isCountry(country)) return {};
    const { brand, name } = COUNTRIES[country];
    return { title: brand, description: `Search for universities in ${name}` };
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
