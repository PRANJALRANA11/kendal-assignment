import { NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  deletePropertyParamsSchema,
  updatePropertySchema,
} from "@/app/schema/property";
import { z } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate params and body
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const propertyData = JSON.parse(formData.get("data") as string);

    const validatedParams = deletePropertyParamsSchema.parse(params);
    const validatedData = updatePropertySchema.parse({
      id: validatedParams.id,
      data: propertyData,
    });

    const propertyRef = doc(db, "properties", validatedParams.id);

    let updates = {
      ...validatedData.data,
      updatedAt: new Date(),
    };

    // If there's a new image
    if (imageFile) {
      // Delete old image if it exists
      if (validatedData.data.image) {
        try {
          const oldImageRef = ref(storage, validatedData.data.image);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn("Error deleting old image:", error);
        }
      }

      // Upload new image
      const imageRef = ref(
        storage,
        `properties/${Date.now()}_${imageFile.name}`
      );
      const imageBuffer = await imageFile.arrayBuffer();
      await uploadBytes(imageRef, imageBuffer);
      const imageUrl = await getDownloadURL(imageRef);
      updates.image = imageUrl;
    }

    await updateDoc(propertyRef, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}
