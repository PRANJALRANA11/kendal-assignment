import { NextResponse } from "next/server";
import { databases, storage } from "@/lib/appwrite";
import { z } from "zod";
import { Query } from "node-appwrite";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // Directly access params without await

    // Parse and validate form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const propertyData = JSON.parse(formData.get("data") as string);

    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION!;
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET!;

    // Fetch the existing property document
    const property = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("id", id),
    ]);

    if (property.documents.length === 0) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const documentId = property.documents[0].$id;
    console.log("Updating property:", propertyData);

    let updates = {
      ...propertyData,
      updatedAt: new Date().toISOString(),
    };

    // Handle image update if a new image is provided
    if (imageFile) {
      const oldImage = property.documents[0].image;
      if (oldImage) {
        try {
          await storage.deleteFile(bucketId, oldImage);
        } catch (error) {
          console.warn("Error deleting old image:", error);
        }
      }

      const uploadedFile = await storage.createFile(
        bucketId,
        "unique()",
        imageFile
      );
      const imageUrl = storage.getFileView(bucketId, uploadedFile.$id);
      updates.image = imageUrl;
    }

    // Update the document in Appwrite
    await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      updates
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}
