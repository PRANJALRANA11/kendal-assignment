import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Updated data for properties
const data = {
  properties: [
    {
      title: "Modern Apartment",
      imageUrl: "https://via.placeholder.com/150",
      price: "$1200/month",
      location: "New York, NY",
      description:
        "A beautiful modern apartment located in the heart of the city.",
    },
    {
      title: "Cozy Cottage",
      imageUrl: "https://via.placeholder.com/150",
      price: "$800/month",
      location: "Austin, TX",
      description: "A quaint and cozy cottage surrounded by nature.",
    },
    {
      title: "Luxury Villa",
      imageUrl: "https://via.placeholder.com/150",
      price: "$5000/month",
      location: "Los Angeles, CA",
      description:
        "An extravagant villa with stunning views and top-notch amenities.",
    },
    {
      title: "Luxury Villa",
      imageUrl: "https://via.placeholder.com/150",
      price: "$5000/month",
      location: "Los Angeles, CA",
      description:
        "An extravagant villa with stunning views and top-notch amenities.",
    },
    {
      title: "Luxury Villa",
      imageUrl: "https://via.placeholder.com/150",
      price: "$5000/month",
      location: "Los Angeles, CA",
      description:
        "An extravagant villa with stunning views and top-notch amenities.",
    },
    {
      title: "Luxury Villa",
      imageUrl: "https://via.placeholder.com/150",
      price: "$5000/month",
      location: "Los Angeles, CA",
      description:
        "An extravagant villa with stunning views and top-notch amenities.",
    },
  ],
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {" "}
                      <GalleryVerticalEnd className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold hidden md:block">
                    Property Listings
                  </span>
                  <span className="hidden md:block">v1.0.0</span>
                </div>
                <Input placeholder="search" className="md:hidden" />
                {/* <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar> */}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="ml-auto mr-10"></div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="grid gap-4 md:grid-cols-2 p-4">
            {data.properties.map((property) => (
              <div
                key={property.title}
                className="flex flex-col rounded-lg border bg-white shadow-md overflow-hidden"
              >
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="h-32 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{property.title}</h3>
                  <p className="text-sm text-gray-500">{property.location}</p>
                  <p className="font-medium text-primary mt-1">
                    {property.price}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {property.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
