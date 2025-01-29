import React, { useState } from "react";
import { useFormik } from "formik";
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
import { Property } from "@/lib/types";
import { post } from "@/lib/api";
import { Pen } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PropertyForm: React.FC<{ onSuccess?: (value: boolean) => void }> = ({
  onSuccess,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formik = useFormik<Property>({
    initialValues: {
      id: uuidv4(),
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

      try {
        const response = await post("create-properties", formData);
        formik.resetForm();
        setIsDialogOpen(false); // Close the dialog on success
        // @ts-ignore
        onSuccess((prev) => !prev);
      } catch (error) {
        alert(`form not submitted successfuly Error : ${error}`);
        console.error("Error creating property:", error);
        setIsDialogOpen(false);
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
        <Button variant="default" className="h-8 bg-black text-white ">
          Create Property
          <Pen className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Property</DialogTitle>
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
                placeholder="enter your property name"
              />
              {formik.errors.name && (
                <div className="text-red-400">{formik.errors.name}</div>
              )}
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
                placeholder="enter your description"
              />
              {formik.errors.description && (
                <div className="text-red-400">{formik.errors.description}</div>
              )}
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                className="input"
                placeholder="enter your price"
              />
              {formik.errors.price && (
                <div className="text-red-400">{formik.errors.price}</div>
              )}
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
                placeholder="enter your location"
              />
              {formik.errors.latitude && (
                <div className="text-red-400">{formik.errors.latitude}</div>
              )}
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
                placeholder="enter your location"
              />
              {formik.errors.longitude && (
                <div className="text-red-400">{formik.errors.longitude}</div>
              )}
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
                placeholder="enter your bedrooms"
              />
              {formik.errors.bedrooms && (
                <div className="text-red-400">{formik.errors.bedrooms}</div>
              )}
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
                placeholder="enter your bathrooms"
              />
              {formik.errors.bathrooms && (
                <div className="text-red-400">{formik.errors.bathrooms}</div>
              )}
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
                placeholder="enter your property type"
              />
              {formik.errors.propertyType && (
                <div className="text-red-400">{formik.errors.propertyType}</div>
              )}
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
                placeholder="enter your area"
              />
              {formik.errors.area && (
                <div className="text-red-400">{formik.errors.area}</div>
              )}
            </div>

            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                onChange={handleImageChange}
                className="input"
                placeholder="Insert an image"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Image preview" width={100} />
              )}
              {formik.errors.image && (
                <div className="text-red-400">{formik.errors.image}</div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-black text-white"
              disabled={isLoading}
            >
              {isLoading ? <span className="loader"></span> : "Submit"}
            </Button>
            <Button
              variant="outline"
              className="bg-white mb-4 lg:mb-0"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyForm;
