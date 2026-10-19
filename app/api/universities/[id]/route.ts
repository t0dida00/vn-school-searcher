// One school's full document, for the map's dialog (the map itself only has the slim GeoJSON)
import { NextResponse, type NextRequest } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { COUNTRIES, DEFAULT_COUNTRY, isCountry } from "../../../lib/countries";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const country = request.nextUrl.searchParams.get("country") ?? DEFAULT_COUNTRY;
    if (!isCountry(country)) {
        return NextResponse.json({ error: `Unknown country: ${country}` }, { status: 404 });
    }
    try {
        const client = await clientPromise;
        const school = await client.db("schoolAPI").collection(COUNTRIES[country].collection).findOne({ "properties.id": id });
        if (!school) return NextResponse.json({ error: `Unknown school: ${id}` }, { status: 404 });
        const res = NextResponse.json(school, { status: 200 });
        res.headers.set("Access-Control-Allow-Origin", "*");
        // Same as the list: school data changes a few times a year
        res.headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
        return res;
    } catch (error) {
        console.error("Failed to fetch school", id, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
