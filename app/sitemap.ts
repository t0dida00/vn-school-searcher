import type { MetadataRoute } from "next";
import { getSchools, SITE_URL } from "./lib/schools";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const schools = await getSchools();
    return [
        { url: `${SITE_URL}/school-list`, priority: 1 },
        { url: `${SITE_URL}/map`, priority: 0.8 },
        ...schools
            .filter((s) => s.properties?.id)
            .map((s) => ({ url: `${SITE_URL}/school/${s.properties.id}`, priority: 0.6 })),
    ];
}
