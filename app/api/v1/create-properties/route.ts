import { NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  propertyBackendSchema,
  propertyFormSchema,
} from "@/app/schema/property";

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const propertyDataRaw = formData.get("data") as string | null;

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

    // Validate the incoming data including the image file
    const validatedFormData = propertyFormSchema.parse({
      ...propertyData,
      image: imageFile,
    });

    // Upload image to Firebase Storage
    const imageRef = ref(storage, `properties/${Date.now()}_${imageFile.name}`);
    const imageBuffer = await imageFile.arrayBuffer();
    await uploadBytes(imageRef, imageBuffer);
    const imageUrl = await getDownloadURL(imageRef);

    // Validate the final data to be stored including the image URL
    const validatedData = propertyBackendSchema.parse({
      ...validatedFormData,
      image: imageUrl,
    });

    // Add validated property to Firestore
    const docRef = await addDoc(collection(db, "properties"), {
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id });
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
