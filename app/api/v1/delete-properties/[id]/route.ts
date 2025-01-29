import { NextResponse } from "next/server";
import { databases, storage } from "@/lib/appwrite";
import { deletePropertyParamsSchema } from "@/app/schema/property";
import { z } from "zod";
import { Query } from "node-appwrite";
import { databaseId, collectionId, bucketId } from "@/lib/config";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate params
    // deletePropertyParamsSchema.parse({ id });

    // Fetch the property document
    const documentList = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("id", id)]
    );

    // Check if the property exists
    if (!documentList.documents.length) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const document = documentList.documents[0];

    // Extract image URL if exists
    const imageUrl = document?.image;
    if (imageUrl) {
      try {
        const fileId = imageUrl.split("/").pop(); // Extract file ID from URL
        if (fileId) {
          await storage.deleteFile(bucketId, fileId);
        }
      } catch (error) {
        console.warn("Error deleting image:", error);
      }
    }

    // Delete the property document
    await databases.deleteDocument(databaseId, collectionId, document.$id);

    return NextResponse.json({ success: true });
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
