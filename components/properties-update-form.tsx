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
import { PropertyFormProps } from "@/lib/types";
import { patch, deleteRequest, get } from "@/lib/api";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const PropertyUpdateForm: React.FC<PropertyFormProps> = ({
  propertyId,
  onSuccess,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);
  const [placeholderData, setPlaceholderData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData();
      console.log();
    }
  }, [propertyId, isDialogOpen]);

  // fetch single property data
  const fetchPropertyData = async () => {
    try {
      const response = await get(`get-property/${propertyId}`);
      console.log("response ss", response.data);
      setOriginalData(response.data);
      setPlaceholderData(response.data);

      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  const deleteProperty = async () => {
    try {
      setIsLoadingDelete(true);
      const response = await deleteRequest(`delete-properties/${propertyId}`);
      console.log("Delete success:", response.data);
      // @ts-ignore
      onSuccess((prev) => !prev);
      setIsDialogOpen(false); // Close dialog on success
      setIsLoadingDelete(false);
    } catch (error: any) {
      setIsLoadingDelete(false);
      alert(`form not submitted successfuly Error : ${error}`);
      console.error(
        "Error deleting property:",
        error.response?.data || error.message
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      image: null,
      latitude: 0,
      longitude: 1,
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
        // @ts-ignore
        if (values[key] !== originalData[key]) {
          // @ts-ignore
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
        await patch(`update-properties/${propertyId}`, formData);

        setIsDialogOpen(false);
        // @ts-ignore
        onSuccess((prev) => !prev);
      } catch (error) {
        console.error("Error updating property:", error);
        alert(`form not submitted successfuly Error : ${error}`);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // handle the image updation
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
        <Button className="bg-black text-white mt-4">Update</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4  max-h-[40vh] lg:max-h-[80vh] overflow-y-auto">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="input"
                placeholder={placeholderData?.name}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                value={formik.values.description}
                onChange={formik.handleChange}
                className="input"
                placeholder={placeholderData?.description}
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                className="input "
                placeholder={placeholderData?.price}
              />
            </div>

            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                className="input"
                placeholder={placeholderData?.latitude}
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                className="input"
                placeholder={placeholderData?.longitude}
              />
            </div>

            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formik.values.bedrooms}
                onChange={formik.handleChange}
                className="input"
                placeholder={placeholderData?.bedrooms}
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formik.values.bathrooms}
                onChange={formik.handleChange}
                className="input"
                placeholder={placeholderData?.bathrooms}
              />
            </div>

            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Input
                id="propertyType"
                name="propertyType"
                type="text"
                value={formik.values.propertyType}
                onChange={formik.handleChange}
                className="input"
                placeholder={placeholderData?.propertyType}
              />
            </div>

            <div>
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                name="area"
                type="number"
                value={formik.values.area}
                onChange={formik.handleChange}
                className="input"
                placeholder={placeholderData?.area}
              />
            </div>

            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                onChange={handleImageChange}
                className="input"
              />
              {imagePreview && (
                <img
                  src={imagePreview || placeholderData?.image}
                  alt="Image preview"
                  width={100}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-black text-white"
              disabled={isLoading}
            >
              {isLoading ? <span className="loader"></span> : "Update"}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-500 text-white mb-4 lg:mb-0"
              onClick={deleteProperty}
            >
              {isLoadingDelete ? (
                <span className="loader"></span>
              ) : (
                "delete property"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyUpdateForm;
