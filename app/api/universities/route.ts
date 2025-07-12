// app/api/universities/route.ts
import { NextResponse } from 'next/server'; // Import NextResponse for App Router API responses
import clientPromise from '../../lib/mongodb'; // Adjust the path to mongodb.ts if needed

export async function GET() { // Export a function named GET for GET requests
  try {
    const client = await clientPromise;
    const db = client.db("schoolAPI"); // Replace with your database name
    const universities = await db.collection("fin_universities").find({}).toArray();
    // const hightschools = await db.collection("highschools").find({}).toArray();
    // const combinedData = [...universities, ...hightschools];
    const combinedData = [...universities,];
     const res = NextResponse.json(combinedData, { status: 200 });
      res.headers.set('Access-Control-Allow-Origin', '*'); // Replace * with specific domain if needed
    res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return res;
  } catch (error) {
    console.error("Failed to fetch universities:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

