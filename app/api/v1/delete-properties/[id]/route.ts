import { NextResponse } from "next/server";
import { databases, storage } from "@/lib/appwrite";
import { z } from "zod";
import { databaseId, collectionId, bucketId } from "@/lib/config";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      // Fetch the property document directly by document ID
      const document = await databases.getDocument(
        databaseId,
        collectionId,
        id
      );

      // Extract image URL if exists
      const imageUrl = document?.image;
      console.log("imageUrl", imageUrl);
      if (imageUrl) {
        try {
          const fileId = imageUrl.match(/\/files\/([^/]+)\//)?.[1];
          // Extract file ID from URL
          console.log("file id", fileId);
          if (fileId) {
            await storage.deleteFile(bucketId, fileId);
          }
        } catch (error) {
          console.warn("Error deleting image:", error);
        }
      }

      // Delete the property document
      await databases.deleteDocument(databaseId, collectionId, id);

      return NextResponse.json({ success: true });
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
    if (error instanceof z.ZodError) {
      console.log(error.errors);
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
