"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
// Dynamically load the map component without SSR
const MapView = dynamic(() => import("@/components/ui/map"), { ssr: false });
import { PropertySidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserButton, SignedIn } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import PropertyForm from "@/components/properties-add-form";
import { Property } from "@/lib/types";
import { Filters } from "@/lib/types";
import { get } from "@/lib/api";

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("price");
  const [filters, setFilters] = React.useState<Filters>({
    priceRange: [0, Math.max(...properties.map((p) => p.price))],
    bedrooms: null,
    bathrooms: null,
    minArea: null,
    propertyType: null,
    title: "",
    description: "",
  });

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await get("get-properties");
        setProperties(response);
        console.log("response", response);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }
    fetchProperties();
  }, [onSuccess]);

  // func to sort the values
  const handleSortChange = (option: string) => {
    setSortOption(option);
    setProperties((prevProperties) => {
      const sortedProperties = [...prevProperties];
      switch (option) {
        case "price":
          return sortedProperties.sort((a, b) => a.price - b.price);
        case "area":
          return sortedProperties.sort((a, b) => a.area - b.area);
        case "bedrooms":
          return sortedProperties.sort((a, b) => a.bedrooms - b.bedrooms);
        default:
          return sortedProperties;
      }
    });
  };

  const handlePropertyChange = (id: string, updatedData: Partial<Property>) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.$id === id ? { ...property, ...updatedData } : property
      )
    );
  };

  const sidebarStyle: React.CSSProperties = {
    "--sidebar-width": "40rem", // Custom CSS property
    "--sidebar-width-mobile": "20rem",
  } as React.CSSProperties;

  return (
    <div className="flex">
      <SidebarProvider style={sidebarStyle}>
        <PropertySidebar
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          setSelectedPropertyId={setSelectedPropertyId}
          handlePropertyChange={handlePropertyChange}
          sortOption={sortOption}
          handleSortChange={handleSortChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          onSuccess={setOnSuccess}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>

            <div className="ml-auto flex items-center space-x-4 px-4 md:px-6">
              <Dialog>
                <DialogTrigger></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <PropertyForm onSuccess={setOnSuccess} />

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          <MapView
            properties={properties}
            selectedPropertyId={selectedPropertyId}
            setSelectedPropertyId={setSelectedPropertyId}
            searchQuery={searchQuery}
            filters={filters}
          />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
