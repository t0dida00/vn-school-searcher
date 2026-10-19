import MapClientWrapper from "../../HOC/MapWrapper";
import { notFound } from "next/navigation";
import { COUNTRIES, type CountryCode } from "../../lib/countries";

// Fully static: the schools come from the GeoJSON bundled with the app (app/map/schools/<country>.json,
// `npm run export:map`), and each school's details from /api/universities/<id> when its dialog opens
export default async function MapPage({ params }: { params: Promise<{ country: string }> }) {
    // Validated by app/[country]/layout.tsx
    const country = (await params).country as CountryCode;
    if (!COUNTRIES[country].hasMap) notFound();
    return <MapClientWrapper country={country} />;
}
