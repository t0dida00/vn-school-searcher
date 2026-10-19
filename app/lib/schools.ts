// Server-side reads for pages that can't self-fetch /api/universities during `next build`
import { cache } from "react";
import clientPromise from "./mongodb";
import { COUNTRIES, type CountryCode } from "./countries";

export const SITE_URL = "https://finunies.vercel.app";

// One query per country per request, shared by generateMetadata and the page
export const getSchools = cache(async (country: CountryCode): Promise<any[]> => {
    const client = await clientPromise;
    const docs = await client.db("schoolAPI").collection(COUNTRIES[country].collection).find({}).toArray();
    // ObjectId isn't serializable across the server/client boundary
    return JSON.parse(JSON.stringify(docs));
});

export async function getSchool(country: CountryCode, id: string) {
    const schools = await getSchools(country);
    return schools.find((s) => s.properties?.id === id) ?? null;
}
