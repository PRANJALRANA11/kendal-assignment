// schemas/property.ts
import { z } from "zod";

// Shared base schema for property data
export const propertyBaseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(1000000000, "Price too high"),
  bedrooms: z
    .number()
    .int("Must be a whole number")
    .min(1, "Must have at least 1 bedroom")
    .max(20, "Too many bedrooms"),
  bathrooms: z
    .number()
    .positive("Must have at least 1 bathroom")
    .max(20, "Too many bathrooms"),
  address: z.object({
    street: z.string().min(5, "Street address is too short"),
    city: z.string().min(2, "City name is too short"),
    state: z.string().length(2, "Please use 2-letter state code"),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  }),
  propertyType: z.enum(["house", "apartment", "condo", "townhouse"], {
    errorMap: () => ({ message: "Invalid property type" }),
  }),
  amenities: z
    .array(z.string())
    .min(1, "Select at least one amenity")
    .max(20, "Too many amenities"),
});

// Frontend form submission schema
export const propertyFormSchema = propertyBaseSchema.extend({
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported"
    ),
});

// Backend validation schema for the parsed form data
export const propertyBackendSchema = propertyBaseSchema.extend({
  image: z.string().url("Invalid image URL"),
});
export const deletePropertyParamsSchema = z.object({
  id: z.string().uuid("Invalid property ID"),
});

export const updatePropertySchema = z.object({
  id: z.string().uuid("Invalid property ID"),
  data: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive").optional(),
    image: z.string().url("Invalid image URL").optional(),
  }),
});

// Type definitions
export type PropertyFormData = z.infer<typeof propertyFormSchema>;
export type PropertyData = z.infer<typeof propertyBackendSchema>;
