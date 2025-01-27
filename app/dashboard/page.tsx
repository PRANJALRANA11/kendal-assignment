"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import L from "leaflet";
import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Property {
  id: string;
  name: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  price: string;
}

export default function Dashboard() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Sample property data
  const properties: Property[] = [
    {
      id: "1",
      name: "Luxury Villa",
      description: "Beautiful 4-bedroom villa with pool",
      image: "/api/placeholder/300/200",
      latitude: 51.505,
      longitude: -0.09,
      price: "$1,200,000",
    },
    {
      id: "2",
      name: "City Apartment",
      description: "Modern 2-bedroom apartment in downtown",
      image: "/api/placeholder/300/200",
      latitude: 51.51,
      longitude: -0.1,
      price: "$750,000",
    },
    {
      id: "3",
      name: "Suburban House",
      description: "Spacious 3-bedroom family home",
      image: "/api/placeholder/300/200",
      latitude: 51.515,
      longitude: -0.08,
      price: "$950,000",
    },
  ];

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperty(propertyId);
  };

  return (
    <div className="block">
      <SidebarProvider
        style={{
          "--sidebar-width": "40rem",
          "--sidebar-width-mobile": "20rem",
        }}
      >
        <PropertySidebar
          properties={properties}
          selectedProperty={selectedProperty}
          onPropertySelect={handlePropertySelect}
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
        selectedProperty={selectedProperty}
        onPropertySelect={handlePropertySelect}
      />
    </div>
  );
}
