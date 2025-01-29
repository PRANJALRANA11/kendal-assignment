import * as Yup from "yup";

// Define the validation schema using Yup
export const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return value && (value as File).size <= 5 * 1024 * 1024; // 5MB limit
    })
    .test(
      "fileFormat",
      "Only .jpg, .png, .webp formats are supported",
      (value) => {
        return (
          value &&
          ["image/jpeg", "image/png", "image/webp"].includes(
            (value as File).type
          )
        );
      }
    ),
  latitude: Yup.number()
    .required("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: Yup.number()
    .required("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  bedrooms: Yup.number()
    .required("Bedrooms are required")
    .integer("Bedrooms must be an integer")
    .min(0, "Bedrooms must be a non-negative integer"),
  bathrooms: Yup.number()
    .required("Bathrooms are required")
    .integer("Bathrooms must be an integer")
    .min(0, "Bathrooms must be a non-negative integer"),
  propertyType: Yup.string().required("Property type is required"),
  area: Yup.number()
    .required("Area is required")
    .positive("Area must be a positive number"),
});
