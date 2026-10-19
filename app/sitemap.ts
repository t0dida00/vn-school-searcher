import type { MetadataRoute } from "next";
import { getSchools, SITE_URL } from "./lib/schools";
import { COUNTRY_CODES, countryPath } from "./lib/countries";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const perCountry = await Promise.all(
        COUNTRY_CODES.map(async (country) => {
            const schools = await getSchools(country);
            return [
                { url: `${SITE_URL}${countryPath(country, "/university-list")}`, priority: 1 },
                { url: `${SITE_URL}${countryPath(country, "/map")}`, priority: 0.8 },
                ...schools
                    .filter((s) => s.properties?.id)
                    .map((s) => ({ url: `${SITE_URL}${countryPath(country, `/school/${s.properties.id}`)}`, priority: 0.6 })),
            ];
        })
    );
    return perCountry.flat();
}
