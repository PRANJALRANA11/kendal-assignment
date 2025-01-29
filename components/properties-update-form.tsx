import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
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
  propertyId: string;
  setIsDialogOpen: (open: boolean) => void;
  isDialogOpen: boolean;
}

const PropertyUpdateForm: React.FC<PropertyFormProps> = ({
  propertyId,
  setIsDialogOpen,
  isDialogOpen,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData();
      console.log();
    }
  }, [propertyId, isDialogOpen]);

  const fetchPropertyData = async () => {
    try {
      const response = await axios.get(`/api/v1/get-property/${propertyId}`);
      setOriginalData(response.data);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  const deleteProperty = async () => {
    try {
      const response = await axios.delete(
        `/api/v1/delete-properties/${propertyId}`
      );
      console.log("Delete success:", response.data);
      setIsDialogOpen(false); // Close dialog on success
    } catch (error: any) {
      console.error(
        "Error deleting property:",
        error.response?.data || error.message
      );
    }
  };

  const formik = useFormik({
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
    enableReinitialize: true, // Ensures form updates with fetched data
    onSubmit: async (values) => {
      setIsLoading(true);

      // Filter only changed fields
      const updatedFields: any = {};
      Object.keys(values).forEach((key) => {
        if (values[key] !== originalData[key]) {
          updatedFields[key] = values[key];
        }
      });

      // If no changes, return early
      if (Object.keys(updatedFields).length === 0) {
        console.log("No changes detected.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(updatedFields));
      if (values.image) {
        formData.append("image", values.image);
      }

      try {
        await axios.patch(`/api/v1/update-properties/${propertyId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error updating property:", error);
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
          <DialogTitle>Update Property</DialogTitle>
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
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
            <Button variant="outline" onClick={deleteProperty}>
              delete property
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyUpdateForm;
