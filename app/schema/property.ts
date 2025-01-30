// schemas/property.ts
import { z } from "zod";

// Shared base schema for property data
export const PropertyBaseSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().url("Invalid image URL"),
  latitude: z
    .number()
    .refine(
      (value) => value >= -90 && value <= 90,
      "Latitude must be between -90 and 90"
    ),
  longitude: z
    .number()
    .refine(
      (value) => value >= -180 && value <= 180,
      "Longitude must be between -180 and 180"
    ),
  price: z.number().positive("Price must be positive"),
  bedrooms: z
    .number()
    .int()
    .nonnegative("Bedrooms must be a non-negative integer"),
  bathrooms: z
    .number()
    .int()
    .nonnegative("Bathrooms must be a non-negative integer"),
  propertyType: z.string(),
  area: z.number().positive("Area must be a positive number"),
});

// Frontend form submission schema
export const propertyFormSchema = PropertyBaseSchema.extend({
  image: z
    .instanceof(File, { message: "A valid image file is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      { message: "Only .jpg, .png, and .webp formats are supported" }
    ),
});

// Backend validation schema for the parsed form data
export const propertyBackendSchema = PropertyBaseSchema.extend({
  image: z.string().url("Invalid image URL"),
});

export const deletePropertyParamsSchema = z.object({
  id: z.string().uuid("Invalid property ID"),
});

export const updatePropertySchema = z.object({
  data: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive").optional(),
    image: z.string().url("Invalid image URL").optional(),
    latitude: z
      .number()
      .refine(
        (value) => value >= -90 && value <= 90,
        "Latitude must be between -90 and 90"
      ),
    longitude: z
      .number()
      .refine(
        (value) => value >= -180 && value <= 180,
        "Longitude must be between -180 and 180"
      ),
    bedrooms: z
      .number()
      .int()
      .nonnegative("Bedrooms must be a non-negative integer"),
    bathrooms: z
      .number()
      .int()
      .nonnegative("Bathrooms must be a non-negative integer"),
    propertyType: z.string(),
    area: z.number().positive("Area must be a positive number"),
  }),
});

// Type definitions
export type PropertyFormData = z.infer<typeof propertyFormSchema>;
export type PropertyData = z.infer<typeof propertyBackendSchema>;
