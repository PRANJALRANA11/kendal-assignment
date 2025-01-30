import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { databaseId, collectionId } from "@/lib/config";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    try {
      // Fetch the property document directly by document ID
      const property = await databases.getDocument(
        databaseId,
        collectionId,
        id
      );

      return NextResponse.json(
        { success: true, data: property },
        { status: 200 }
      );
    } catch (error: any) {
      // Check if the error is due to document not found
      if (error?.code === 404) {
        return NextResponse.json(
          { error: "Property not found" },
          { status: 404 }
        );
      }
      throw error; // Re-throw other errors to be caught by the outer try-catch
    }
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property. Please try again later." },
      { status: 500 }
    );
  }
}
