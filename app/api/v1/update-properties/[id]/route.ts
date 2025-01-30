import { NextResponse } from "next/server";
import { databases, storage } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { databaseId, collectionId, bucketId } from "@/lib/config";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Parse and validate form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const propertyData = JSON.parse(formData.get("data") as string);

    try {
      // Fetch the existing property document directly by ID
      const property = await databases.getDocument(
        databaseId,
        collectionId,
        id
      );

      let updates = {
        ...propertyData,
      };

      // Handle image update if a new image is provided
      if (imageFile && imageFile.size > 0) {
        // Delete old image if it exists
        if (property.image) {
          try {
            const oldFileIdMatch = property.image.match(/\/files\/([^/]+)\//);
            const oldFileId = oldFileIdMatch ? oldFileIdMatch[1] : null;

            if (oldFileId) {
              await storage.deleteFile(bucketId, oldFileId);
            }
          } catch (error) {
            console.warn("Error deleting old image:", error);
          }
        }

        // Upload new image
        const fileId = ID.unique();
        const uploadedFile = await storage.createFile(
          bucketId,
          fileId,
          imageFile
        );

        // Get the file's public URL
        const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
        updates.image = imageUrl;
      }

      // Update the document in Appwrite
      await databases.updateDocument(databaseId, collectionId, id, updates);

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
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}
