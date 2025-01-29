// app/api/properties/route.ts

import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { databaseId, collectionId, bucketId } from "@/lib/config";

export async function GET() {
  try {
    // Fetch all documents in the "properties" collection
    const response = await databases.listDocuments(databaseId, collectionId);

    // Map and format the data as needed
    const properties = response.documents.map((doc) => ({
      id: doc.$id,
      ...doc,
      createdAt: doc.createdAt, // Use Appwrite's timestamp fields directly
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
