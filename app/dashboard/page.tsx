"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import L from "leaflet";
import React, { useEffect, useState } from "react";
// Dynamically load the map component without SSR
const MapView = dynamic(() => import("@/components/ui/map"), { ssr: false });
import { PropertySidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserButton, SignedIn } from "@clerk/nextjs";
import { Pen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropertyForm from "@/components/properties-add-form";

interface Property {
  id: string;
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

const initialProperties: Property[] = [
  {
    id: 1,
    name: "Luxury Apartment",
    description: "A beautiful apartment with modern amenities.",
    image: "https://via.placeholder.com/150",
    price: 1000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    propertyType: "Apartment",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: 2,
    name: "Cozy Cottage",
    description: "A quaint cottage in the countryside.",
    image: "https://via.placeholder.com/150",
    price: 500000,
    bedrooms: 2,
    bathrooms: 1,
    area: 800,
    propertyType: "Cottage",
    latitude: 37.7849,
    longitude: -122.4094,
  },
];

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("price");
  const [filters, setFilters] = React.useState({
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
        const response = await axios.get("/api/v1/get-properties");
        setProperties(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }
    fetchProperties();
  }, []);

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

  const handlePropertyChange = (id: number, updatedData: Partial<Property>) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === id ? { ...property, ...updatedData } : property
      )
    );
  };

  const handleSuccess = (id: string) => {
    // setPropertyId(id);
    alert(`Property created successfully with ID: ${id}`);
  };

  return (
    <div className="block">
      <PropertyForm onSuccess={handleSuccess} />
      <SidebarProvider
        style={{
          "--sidebar-width": "40rem",
          "--sidebar-width-mobile": "20rem",
        }}
      >
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
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Input
                      placeholder="Search"
                      className="lg:w-96 hidden md:block"
                    />
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="ml-auto flex items-center space-x-4 px-4 md:px-6">
              <Dialog>
                <DialogTrigger>
                  {/* <Button
                    variant="default"
                    className="h-8 bg-black text-white "
                  > */}
                  {/* Enter Details */}
                  <Pen className="ml-2 h-4 w-4" />
                  {/* </Button> */}
                </DialogTrigger>
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

              <Button variant="default" className="h-8 bg-black text-white ">
                Draw
                <Pen className="ml-2 h-4 w-4" />
              </Button>
              {/* <SignedIn>
                <UserButton />
              </SignedIn> */}
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <MapView
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        setSelectedPropertyId={setSelectedPropertyId}
        searchQuery={searchQuery}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
