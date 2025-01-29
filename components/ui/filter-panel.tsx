import React, { useEffect, useState, useCallback } from "react";
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
import { PropertyFilters, FilterPanelProps } from "@/lib/types";
const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Condo",
  "Townhouse",
  "Villa",
  "Land",
];

export function FilterPanel({
  onFiltersChange,
  properties,
  filters,
}: FilterPanelProps) {
  // Calculate price bounds once on component mount
  const maxPrice = React.useMemo(
    () => Math.max(...properties.map((p) => p.price)),
    [properties]
  );
  console.log("max price", maxPrice);

  const minPrice = React.useMemo(
    () => Math.min(...properties.map((p) => p.price)),
    [properties]
  );
  console.log("min price", minPrice);

  // Update filters when properties change
  useEffect(() => {
    onFiltersChange({
      ...filters,
      priceRange: [minPrice, maxPrice],
    });
  }, [minPrice, maxPrice]);

  const handleFilterChange = useCallback(
    (field: keyof PropertyFilters, value: any) => {
      const newFilters = { ...filters, [field]: value };
      onFiltersChange(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetFilters = useCallback(() => {
    const defaultFilters: PropertyFilters = {
      priceRange: [minPrice, maxPrice],
      bedrooms: null,
      bathrooms: null,
      minArea: null,
      propertyType: null,
      title: "",
      description: "",
    };
    onFiltersChange(defaultFilters);
  }, [minPrice, maxPrice, onFiltersChange]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-black">
          <Filter className="h-4 w-4 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px] max-h-[100vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
          <SheetDescription>
            Adjust the filters to find your perfect property
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="pt-2 px-2">
              <Slider
                value={filters.priceRange}
                max={maxPrice}
                min={minPrice}
                step={5000}
                onValueChange={(value: [number, number]) =>
                  handleFilterChange("priceRange", value)
                }
                className="mb-2 "
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Rest of the component remains the same */}
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
                <SelectTrigger className="">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="any">Any</SelectItem>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem
                      className="hover:bg-slate-50 cursor-pointer"
                      key={num}
                      value={num.toString()}
                    >
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
                <SelectContent className="bg-white">
                  <SelectItem value="any">Any</SelectItem>
                  {[1, 2, 3, 4].map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      {num}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
              <SelectContent className="bg-white">
                <SelectItem value="any">Any type</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="hover:bg-slate-50 cursor-pointer"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-2">
            <Label>Title Contains</Label>
            <Input
              placeholder="Search in titles..."
              value={filters.title}
              onChange={(e) => handleFilterChange("title", e.target.value)}
            />
          </div>

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

          <Button
            onClick={resetFilters}
            className="bg-black mt-4 text-white"
            variant="outline"
          >
            Reset Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
