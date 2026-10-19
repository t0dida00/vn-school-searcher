import { schoolId } from "./schoolId";

// properties.campuses lists a school's OTHER teaching campuses; the school's own geometry/city is the main one
export type Campus = { name: string; city: string; address?: string; coordinates: [number, number]; sourceUrl?: string };

// Separates a school id from its campus slug in map feature ids: "lut~lahti-campus"
const CAMPUS_SEPARATOR = "~";

function isCampus(value: any): value is Campus {
    const c = value?.coordinates;
    return typeof value?.name === "string" && Array.isArray(c) && c.length === 2 && c.every(Number.isFinite);
}

// Like stringToArray: Mapbox and older data can hand nested properties over as JSON strings
export function campusesOf(school: any): Campus[] {
    let value = school?.properties?.campuses;
    if (typeof value === "string") {
        try {
            value = JSON.parse(value);
        } catch {
            return [];
        }
    }
    return Array.isArray(value) ? value.filter(isCampus) : [];
}

// "Lahti Campus" → "lahti-campus": campus feature ids and the map's ?campus= deep link
export function campusSlug(text: string) {
    return text
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

// The school a map feature belongs to: its own id for a main pin, the part before "~" for a campus pin
export function parentIdOf(featureOrId: any): string {
    const id = typeof featureOrId === "string" ? featureOrId : featureOrId?.properties?.parentId ?? schoolId(featureOrId);
    return String(id ?? "").split(CAMPUS_SEPARATOR)[0];
}

// One map feature per main campus plus one per extra campus. Campus features carry the school's display
// fields (name, logo, rank, ...) with the campus city, so markers and the result list can render them.
export function toMapFeatures(schools: any[]): any[] {
    return schools.flatMap((school) => {
        const id = schoolId(school);
        const campuses = campusesOf(school).map((campus) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: campus.coordinates },
            properties: {
                ...school.properties,
                campuses: undefined,
                id: `${id}${CAMPUS_SEPARATOR}${campusSlug(campus.name)}`,
                parentId: id,
                campus: campus.name,
                city: campus.city,
            },
        }));
        return [school, ...campuses];
    });
}

// A school as seen from one of its campuses (opened from that campus's map pin): location, city and address
// are the campus's, so the details and Directions point there. `campus` names it under the title and
// `mainCity`/`mainCoordinates` keep the main campus for the Campuses list. The id stays the school's, so saving, sharing
// and the selected-pin state still refer to the school.
export function campusView(school: any, campus: Campus) {
    return {
        ...school,
        geometry: { type: "Point", coordinates: campus.coordinates },
        properties: {
            ...school.properties,
            city: campus.city,
            address: campus.address,
            campus: campus.name,
            mainCity: school.properties?.city,
            mainCoordinates: school.properties?.mainCoordinates ?? school.geometry?.coordinates,
        },
    };
}
