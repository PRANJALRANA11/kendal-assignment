import { NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { deletePropertyParamsSchema } from "@/app/schema/property";
import { z } from "zod";
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate params
    const validatedParams = deletePropertyParamsSchema.parse(params);

    // Get the property first to get the image URL
    const docRef = doc(db, "properties", validatedParams.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const imageUrl = docSnap.data().image;

    // Delete image from storage if it exists
    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn("Error deleting image:", error);
      }
    }

    // Delete property document
    await deleteDoc(docRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
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
