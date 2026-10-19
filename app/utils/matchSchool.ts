import { stringToArray } from "./stringToArray";
import { campusesOf } from "./campuses";

export type SchoolFilters = { query: string; city: string; field: string; type: string };

export const EMPTY_FILTERS: SchoolFilters = { query: "", city: "", field: "", type: "all" };

// Shared by the list and map views. city/field come from public/filter-options/<country>.json (lowercased city values)
export function matchSchool(item: any, { query, city, field, type }: SchoolFilters) {
    const p = item.properties || {};
    const fields = stringToArray(p.fieldOptions).map((f) => f.toLowerCase());
    const campuses = campusesOf(item);
    // A school counts as being in every city it has a campus in
    const cities: string[] = [p.city, ...campuses.map((c) => c.city)].filter(Boolean);

    if (type !== "all" && p.type !== type) return false;
    if (city && !cities.some((c) => c.toLowerCase().includes(city))) return false;
    if (field && !fields.includes(field.toLowerCase())) return false;

    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.code, p.address, ...cities, ...campuses.map((c) => c.name), ...fields].some((v) => v?.toLowerCase().includes(q));
}
