// app/api/universities/route.ts
import { NextResponse, type NextRequest } from 'next/server'; // Import NextResponse for App Router API responses
import clientPromise from '../../lib/mongodb'; // Adjust the path to mongodb.ts if needed
import { COUNTRIES, DEFAULT_COUNTRY, isCountry } from '../../lib/countries';

// ?country=fi picks the country's collection; without it, the default country (keeps old clients working)
export async function GET(request: NextRequest) { // Export a function named GET for GET requests
  const country = request.nextUrl.searchParams.get("country") ?? DEFAULT_COUNTRY;
  if (!isCountry(country)) {
    return NextResponse.json({ error: `Unknown country: ${country}` }, { status: 404 });
  }
  try {
    const client = await clientPromise;
    const db = client.db("schoolAPI"); // Replace with your database name
    const universities = await db.collection(COUNTRIES[country].collection).find({}).toArray();
    // const hightschools = await db.collection("highschools").find({}).toArray();
    // const combinedData = [...universities, ...hightschools];
    const combinedData = [...universities,];
     const res = NextResponse.json(combinedData, { status: 200 });
      res.headers.set('Access-Control-Allow-Origin', '*'); // Replace * with specific domain if needed
    res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    // The data changes about twice a year: the CDN serves a cached copy for a day and refreshes it in the background for a week after
    res.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    
    return res;
  } catch (error) {
    console.error("Failed to fetch universities:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

