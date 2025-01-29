// app/api/properties/route.ts

import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

export async function GET() {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION;

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
