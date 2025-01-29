import { NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { databases, storage } from "@/lib/appwrite";
import {
  propertyBackendSchema,
  propertyFormSchema,
} from "@/app/schema/property";
import { databaseId, collectionId, bucketId } from "@/lib/config";

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const propertyDataRaw = formData.get("data") as string | null;
    console.log("property data", propertyDataRaw);

    if (!imageFile || !propertyDataRaw) {
      return NextResponse.json(
        { error: "Image file or property data is missing" },
        { status: 400 }
      );
    }

    // Parse property data from the raw JSON string
    let propertyData;
    try {
      propertyData = JSON.parse(propertyDataRaw);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in property data" },
        { status: 400 }
      );
    }

    // Extract ID from property data if it exists
    const documentId = ID.unique();
    console.log("Document ID to be used:", documentId);

    // Validate the incoming data including the image file
    const validatedFormData = propertyFormSchema.parse({
      ...propertyData,
      image: imageFile,
    });

    const fileId = ID.unique(); // Generate a unique file ID

    console.log("Starting file upload...");
    console.log("Bucket ID:", bucketId);
    console.log("File ID:", fileId);
    console.log("Image File:", imageFile);

    const fileResponse = await storage.createFile(bucketId, fileId, imageFile);

    // Get the file's public URL
    const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;

    // Validate the final data to be stored including the image URL
    const validatedData = propertyBackendSchema.parse({
      ...validatedFormData,
      image: imageUrl,
    });

    // Create document with either provided ID or generated ID
    const docRef = await databases.createDocument(
      databaseId,
      collectionId,
      documentId, // Use the extracted or generated ID
      {
        // @ts-ignore
        id: documentId, // Include ID in the document data
        ...validatedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return NextResponse.json({ id: docRef.$id });
  } catch (error: any) {
    console.error("Error creating property:", error);

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    // Handle general errors
    return NextResponse.json(
      { error: "Failed to create property", message: error.message },
      { status: 500 }
    );
  }
}
