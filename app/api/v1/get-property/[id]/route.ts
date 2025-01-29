import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log("id", id);

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION as string;

    // Fetch the property document from Appwrite
    const property = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("id", id),
    ]);

    return NextResponse.json(
      { success: true, data: property },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property. Please try again later." },
      { status: 500 }
    );
  }
}
