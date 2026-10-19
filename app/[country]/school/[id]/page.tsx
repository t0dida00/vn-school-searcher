import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import RankTag from "../../../components/RankTag";
import { SchoolDetailActions, SchoolDetailBody, SchoolDetailHeader } from "../../../components/SchoolDetails/SchoolDetailContent";
import { getSchool, getSchools } from "../../../lib/schools";
import { COUNTRIES, countryPath, type CountryCode } from "../../../lib/countries";

// School data changes about twice a year; regenerate daily
export const revalidate = 86400;

// country is validated by app/[country]/layout.tsx
type Props = { params: Promise<{ country: CountryCode; id: string }> };

// Runs once per country from the parent layout's generateStaticParams
export async function generateStaticParams({ params }: { params: { country: CountryCode } }) {
    const schools = await getSchools(params.country);
    return schools.filter((s) => s.properties?.id).map((s) => ({ id: s.properties.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { country, id } = await params;
    const school = await getSchool(country, id);
    if (!school) return { title: "School not found · FinUnies" };
    const { name, city, overview, logo } = school.properties;
    const description = overview ? overview.slice(0, 160) : `${name} in ${city}, ${COUNTRIES[country].name}.`;
    return {
        title: `${name} · FinUnies`,
        description,
        alternates: { canonical: countryPath(country, `/school/${school.properties.id}`) },
        openGraph: { title: name, description, images: logo ? [logo] : undefined },
    };
}

export default async function SchoolPage({ params }: Props) {
    const { country, id } = await params;
    const school = await getSchool(country, id);
    if (!school) notFound();

    return (
        <main className="mx-auto max-w-3xl px-4 pb-12 pt-4 sm:pt-8">
            <div className="mb-4 flex items-center justify-between gap-2">
                <Button asChild variant="ghost" size="sm" className="-ml-2.5">
                    <Link href={countryPath(country, "/university-list")}>
                        <ArrowLeft />
                        All schools
                    </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <Link href={countryPath(country, `/map?school=${encodeURIComponent(id)}`)}>
                        <MapIcon />
                        View on map
                    </Link>
                </Button>
            </div>

            <article className="overflow-hidden rounded-xl border bg-card shadow-xs">
                <div className="border-b p-5">
                    <SchoolDetailHeader
                        school={school}
                        title={
                            <h1 className="text-xl font-semibold leading-snug [overflow-wrap:anywhere] sm:text-2xl">
                                {school.properties.name}
                                <RankTag school={school} className="ml-2" />
                            </h1>
                        }
                    />
                </div>
                <div className="p-5">
                    <SchoolDetailBody school={school} />
                </div>
                <div className="border-t bg-muted/30 p-4">
                    <SchoolDetailActions school={school} />
                </div>
            </article>
        </main>
    );
}
