import * as React from "react";
import { GalleryVerticalEnd, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface Property {
  id: string;
  name: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  price: string;
}

interface PropertySidebarProps extends React.ComponentProps<typeof Sidebar> {
  properties: Property[];
  selectedProperty: string | null;
  onPropertySelect: (propertyId: string) => void;
}

export function PropertySidebar({
  properties,
  selectedProperty,
  onPropertySelect,
  ...props
}: PropertySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.price.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center w-full gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <GalleryVerticalEnd className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter Properties</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                      <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                      <DropdownMenuItem>Latest</DropdownMenuItem>
                      <DropdownMenuItem>Most Popular</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold hidden md:block">
                    Property Listings
                  </span>
                  <span className="text-sm text-gray-500 hidden md:block">
                    {filteredProperties.length} properties found
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-4 py-2 w-full">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search properties..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="grid gap-4 p-4">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => onPropertySelect(property.id)}
                className={`flex flex-col rounded-lg border bg-white shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedProperty === property.id
                    ? "ring-2 ring-primary border-primary"
                    : "hover:shadow-lg"
                }`}
              >
                <img
                  src={property.image}
                  alt={property.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <p className="font-medium text-primary mt-1">
                    {property.price}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {property.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500">
                      Lat: {property.latitude.toFixed(4)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Long: {property.longitude.toFixed(4)}
                    </span>
                  </div>
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
