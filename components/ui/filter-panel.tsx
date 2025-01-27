import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface PropertyFilters {
  priceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  minArea: number | null;
  propertyType: string | null;
  title: string;
  description: string;
}

interface Property {
  id: number;
  name: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  area: number;
}

interface FilterPanelProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  properties: Property[];
}

const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Condo",
  "Townhouse",
  "Villa",
  "Land",
];

export function FilterPanel({ onFiltersChange, properties }: FilterPanelProps) {
  const maxPrice = Math.max(...properties.map((p) => p.price));
  const minPrice = Math.min(...properties.map((p) => p.price));
  const maxArea = Math.max(...properties.map((p) => p.area));

  const [filters, setFilters] = React.useState<PropertyFilters>({
    priceRange: [minPrice, maxPrice],
    bedrooms: null,
    bathrooms: null,
    minArea: null,
    propertyType: null,
    title: "",
    description: "",
  });

  const handleFilterChange = (field: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetFilters = () => {
    const defaultFilters = {
      priceRange: [minPrice, maxPrice],
      bedrooms: null,
      bathrooms: null,
      minArea: null,
      propertyType: null,
      title: "",
      description: "",
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
          <SheetDescription>
            Adjust the filters to find your perfect property
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="pt-2 px-2">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                max={maxPrice}
                min={minPrice}
                step={(maxPrice - minPrice) / 100}
                value={filters.priceRange}
                onValueChange={(value) =>
                  handleFilterChange("priceRange", value)
                }
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Select
                value={filters.bedrooms?.toString() || "any"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "bedrooms",
                    value === "any" ? null : parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Select
                value={filters.bathrooms?.toString() || "any"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "bathrooms",
                    value === "any" ? null : parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {[1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select
              value={filters.propertyType || "any"}
              onValueChange={(value) =>
                handleFilterChange(
                  "propertyType",
                  value === "any" ? null : value
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any type</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Minimum Area */}
          <div className="space-y-2">
            <Label>Minimum Area (sq ft)</Label>
            <Input
              type="number"
              placeholder="Any size"
              value={filters.minArea || ""}
              onChange={(e) =>
                handleFilterChange(
                  "minArea",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            />
          </div>

          {/* Title Search */}
          <div className="space-y-2">
            <Label>Title Contains</Label>
            <Input
              placeholder="Search in titles..."
              value={filters.title}
              onChange={(e) => handleFilterChange("title", e.target.value)}
            />
          </div>

          {/* Description Search */}
          <div className="space-y-2">
            <Label>Description Contains</Label>
            <Input
              placeholder="Search in descriptions..."
              value={filters.description}
              onChange={(e) =>
                handleFilterChange("description", e.target.value)
              }
            />
          </div>

          {/* Reset Button */}
          <Button onClick={resetFilters} variant="outline" className="mt-4">
            Reset Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
