// Stores "Report a problem" submissions from a school's details in schoolAPI.reports, for review.
// Nothing identifying is kept (no IP address, user agent or contact details); the privacy policy says so.
import { NextResponse, type NextRequest } from "next/server";
import clientPromise from "../../lib/mongodb";
import { COUNTRIES, isCountry } from "../../lib/countries";
import { isReportReason, REPORT_NOTE_MAX } from "../../lib/reports";

// An identical report (same school, reason and note) within this window is accepted but not stored again
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
    let body: any;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Expected a JSON body" }, { status: 400 });
    }
    const { country, schoolId, reason } = body ?? {};
    const note = typeof body?.note === "string" ? body.note.trim().slice(0, REPORT_NOTE_MAX) : "";
    const campus = typeof body?.campus === "string" ? body.campus.trim().slice(0, 200) : "";
    if (!isCountry(country)) return NextResponse.json({ error: "Unknown country" }, { status: 400 });
    if (typeof schoolId !== "string" || !schoolId || schoolId.length > 100) return NextResponse.json({ error: "Unknown school" }, { status: 400 });
    if (!isReportReason(reason)) return NextResponse.json({ error: "Unknown reason" }, { status: 400 });

    try {
        const db = (await clientPromise).db("schoolAPI");
        const school = await db.collection(COUNTRIES[country].collection).findOne({ "properties.id": schoolId }, { projection: { "properties.name": 1 } });
        if (!school) return NextResponse.json({ error: "Unknown school" }, { status: 404 });

        const reports = db.collection("reports");
        const duplicate = await reports.findOne({ country, schoolId, reason, note, createdAt: { $gt: new Date(Date.now() - DUPLICATE_WINDOW_MS) } });
        if (!duplicate) {
            await reports.insertOne({
                country,
                schoolId,
                schoolName: school.properties?.name ?? null,
                reason,
                note: note || null,
                campus: campus || null,
                status: "open",
                createdAt: new Date(),
            });
        }
        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        console.error("Failed to store report", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
