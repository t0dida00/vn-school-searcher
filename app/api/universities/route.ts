// app/api/universities/route.ts
import { NextResponse } from 'next/server'; // Import NextResponse for App Router API responses
import clientPromise from '../../lib/mongodb'; // Adjust the path to mongodb.ts if needed

export async function GET(request: Request) { // Export a function named GET for GET requests
  try {
    const client = await clientPromise;
    const db = client.db("schoolAPI"); // Replace with your database name
    const universities = await db.collection("universities").find({}).toArray();
    const hightschools = await db.collection("highschools").find({}).toArray();
    const combinedData = [...universities, ...hightschools];
    return NextResponse.json(combinedData, { status: 200 }); // Use NextResponse.json
  } catch (error) {
    console.error("Failed to fetch universities:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

