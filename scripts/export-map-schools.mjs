// Writes app/map/schools/<country>.json: a slim GeoJSON of every school for the map (pins, clusters, search).
// The map imports these instead of calling the API; a school's full details load when its dialog opens.
// Run after changing school data in MongoDB:  npm run export:map
import { mkdirSync, writeFileSync } from "node:fs";
import { MongoClient } from "mongodb";

// Keep in sync with app/lib/countries.ts (countries with hasMap: true)
const COLLECTIONS = { fi: "fin_universities", vn: "vn_universities" };
// What the map needs: pins and the result list (name, logo, code, city, type, rank), search (fields)
// and campus pins (name, city, coordinates). Everything else comes from /api/universities/<id>.
const KEEP = ["id", "name", "code", "logo", "city", "type", "ranking", "fieldOptions"];

function fieldsOf(value) {
    if (Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
try {
    const outDir = new URL("../app/map/schools/", import.meta.url);
    mkdirSync(outDir, { recursive: true });
    for (const [country, collection] of Object.entries(COLLECTIONS)) {
        const docs = await client.db("schoolAPI").collection(collection).find({}).toArray();
        const features = docs
            .filter((d) => d.properties?.id && d.geometry?.type === "Point")
            .map((d) => {
                const p = d.properties;
                const properties = Object.fromEntries(KEEP.filter((k) => p[k] !== undefined && p[k] !== null).map((k) => [k, p[k]]));
                properties.fieldOptions = fieldsOf(p.fieldOptions);
                const campuses = (Array.isArray(p.campuses) ? p.campuses : []).map(({ name, city, coordinates }) => ({ name, city, coordinates }));
                if (campuses.length) properties.campuses = campuses;
                return { type: "Feature", geometry: d.geometry, properties };
            })
            .sort((a, b) => a.properties.id.localeCompare(b.properties.id));
        const file = new URL(`${country}.json`, outDir);
        writeFileSync(file, JSON.stringify({ type: "FeatureCollection", features }) + "\n");
        console.log(`${country}: ${features.length} schools -> app/map/schools/${country}.json`);
    }
} finally {
    await client.close();
}
