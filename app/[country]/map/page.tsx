import MapClientWrapper from "../../HOC/MapWrapper";
import { notFound } from "next/navigation";
import { COUNTRIES, type CountryCode } from "../../lib/countries";
import { getSchools } from "../../lib/schools";

// School data changes about twice a year; regenerate daily
export const revalidate = 86400;

export default async function HomePage({ params }: { params: Promise<{ country: string }> }) {
    // Validated by app/[country]/layout.tsx
    const country = (await params).country as CountryCode;
    if (!COUNTRIES[country].hasMap) notFound();
    let data = null;
    let error = null;

    // Straight from MongoDB, not over HTTP: during `next build` a self-fetch would hit whatever deployment
    // NEXT_INTERNAL_BASE_URL points at, which may still be an older API that ignores ?country
    try {
        data = await getSchools(country);
    } catch (err) {
        console.error("Failed to load schools for the map", err);
        error = "An unexpected error occurred";
    }

    return <MapClientWrapper data={data} error={error} country={country} />;
}
