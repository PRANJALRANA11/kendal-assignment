import { PropertySidebarProps } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PropertyUpdateForm from "./properties-update-form";
import * as React from "react";
import { GalleryVerticalEnd, Search } from "lucide-react";
import L from "leaflet";
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
import { FilterPanel } from "./ui/filter-panel";

export function PropertySidebar({
  properties,
  selectedPropertyId,
  setSelectedPropertyId,
  handlePropertyChange,
  sortOption,
  handleSortChange,
  searchQuery,
  setSearchQuery,
  filters,
  onFiltersChange,
  onSuccess,
  drawnPolygon,
  ...props
}: PropertySidebarProps) {
  const [userId, setUserId] = React.useState("");

  // to filter the properties based on search and filter
  const filteredProperties = React.useMemo(() => {
    return properties.filter((property) => {
      // Basic search filter
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch =
        property.name.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.propertyType.toLowerCase().includes(searchTerm) ||
        property.price.toString().includes(searchTerm) ||
        property.bedrooms.toString().includes(searchTerm) ||
        property.bathrooms.toString().includes(searchTerm) ||
        property.area.toString().includes(searchTerm);

      // Advanced filters
      const matchesPrice =
        property.price >= filters.priceRange[0] &&
        property.price <= filters.priceRange[1];
      const matchesBedrooms =
        !filters.bedrooms || property.bedrooms >= filters.bedrooms;
      const matchesBathrooms =
        !filters.bathrooms || property.bathrooms >= filters.bathrooms;
      const matchesArea = !filters.minArea || property.area >= filters.minArea;
      const matchesType =
        !filters.propertyType || property.propertyType === filters.propertyType;
      const matchesTitle =
        !filters.title ||
        property.name.toLowerCase().includes(filters.title.toLowerCase());
      const matchesDescription =
        !filters.description ||
        property.description
          .toLowerCase()
          .includes(filters.description.toLowerCase());

      // Check if property is inside polygon (if one exists)
      const matchesPolygon = drawnPolygon
        ? drawnPolygon
            .getBounds()
            .contains(L.latLng(property.latitude, property.longitude))
        : true;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesArea &&
        matchesType &&
        matchesTitle &&
        matchesDescription &&
        matchesPolygon
      );
    });
  }, [
    properties,
    filters.priceRange,
    filters.bedrooms,
    filters.bathrooms,
    filters.minArea,
    filters.propertyType,
    filters.title,
    filters.description,
    searchQuery,
    drawnPolygon,
  ]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center w-full gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <GalleryVerticalEnd className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="hover:bg-slate-100 cursor-pointer"
                        onClick={() => handleSortChange("price")}
                      >
                        Price
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="hover:bg-slate-100 cursor-pointer"
                        onClick={() => handleSortChange("area")}
                      >
                        Area
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="hover:bg-slate-100 cursor-pointer"
                        onClick={() => handleSortChange("bedrooms")}
                      >
                        Bedrooms
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold ">Property Listings</span>
                  <span className="text-sm text-gray-500">
                    {filteredProperties.length} properties found
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-4 py-2 w-full">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search properties..."
                className="pl-8 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <FilterPanel
              properties={properties}
              onFiltersChange={onFiltersChange}
              filters={filters}
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="grid gap-2 lg:grid-cols-2 p-4">
            {filteredProperties.map((property) => (
              <div
                key={property.$id}
                onClick={() => setSelectedPropertyId(property.$id)}
                className={`flex flex-col rounded-lg border bg-white shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedPropertyId === property.$id
                    ? "ring-2 ring-primary border-primary"
                    : "hover:shadow-lg"
                }`}
              >
                <img
                  src={property.image || ""}
                  alt={property.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <p className="font-medium text-primary mt-1">
                    ${property.price.toLocaleString()}
                  </p>
                  <div className="flex flex-wrap lg:gap-3 gap-1 text-sm text-gray-600 mt-2">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.area} sq ft</span>
                    <span>{property.propertyType}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {property.description}
                  </p>
                  <div
                    onClick={() => {
                      setUserId(property.$id);
                      console.log("clicked", property.$id);
                    }}
                  >
                    {" "}
                    <PropertyUpdateForm
                      propertyId={userId}
                      onSuccess={onSuccess}
                    />
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
