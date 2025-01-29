import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { validationSchema } from "@/app/schema/validation";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PropertyFormProps {
  onSuccess: (id: string) => void; // Callback on success
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSuccess }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formik = useFormik<PropertyFormData>({
    initialValues: {
      id: "",
      name: "",
      description: "",
      image: null,
      latitude: 0,
      longitude: 0,
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      propertyType: "",
      area: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("data", JSON.stringify(values));
      if (values.image) {
        formData.append("image", values.image);
      }
      formData.append("id", uuidv4() + values.latitude + values.longitude);

      try {
        const response = await axios.post(
          "/api/v1/create-properties",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        onSuccess(response.data.id); // Pass the ID to the onSuccess callback
        formik.resetForm();
        setIsDialogOpen(false); // Close the dialog on success
      } catch (error) {
        console.error("Error creating property:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Open Property Form</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.errors.name && <div>{formik.errors.name}</div>}
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <input
                id="description"
                name="description"
                type="text"
                value={formik.values.description}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.errors.description && (
                <div>{formik.errors.description}</div>
              )}
            </div>

            <div>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.errors.price && <div>{formik.errors.price}</div>}
            </div>

            <div>
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.errors.latitude && <div>{formik.errors.latitude}</div>}
            </div>

            <div>
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.errors.longitude && <div>{formik.errors.longitude}</div>}
            </div>

            <div>
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formik.values.bedrooms}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.errors.bedrooms && <div>{formik.errors.bedrooms}</div>}
            </div>

            <div>
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formik.values.bathrooms}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.errors.bathrooms && <div>{formik.errors.bathrooms}</div>}
            </div>

            <div>
              <label htmlFor="propertyType">Property Type</label>
              <input
                id="propertyType"
                name="propertyType"
                type="text"
                value={formik.values.propertyType}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.errors.propertyType && (
                <div>{formik.errors.propertyType}</div>
              )}
            </div>

            <div>
              <label htmlFor="area">Area</label>
              <input
                id="area"
                name="area"
                type="number"
                value={formik.values.area}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.errors.area && <div>{formik.errors.area}</div>}
            </div>

            <div>
              <label htmlFor="image">Image</label>
              <input
                id="image"
                name="image"
                type="file"
                onChange={handleImageChange}
                className="input"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Image preview" width={100} />
              )}
              {formik.errors.image && <div>{formik.errors.image}</div>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyForm;
