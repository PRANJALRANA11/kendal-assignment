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

interface PropertySidebarProps {
  properties: Property[];
  selectedPropertyId: number | null;
  setSelectedPropertyId: (id: number | null) => void;
  handlePropertyChange: (id: number, updatedData: Partial<Property>) => void;
  sortOption: string;
  handleSortChange: (option: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function PropertySidebar({
  properties,
  selectedPropertyId,
  setSelectedPropertyId,
  handlePropertyChange,
  sortOption,
  handleSortChange,
  setSearchQuery,
  searchQuery,
  ...props
}: PropertySidebarProps) {
  const filteredProperties = React.useMemo(() => {
    return properties.filter((property) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        property.name.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.propertyType.toLowerCase().includes(searchTerm) ||
        property.price.toString().includes(searchTerm) ||
        property.bedrooms.toString().includes(searchTerm) ||
        property.bathrooms.toString().includes(searchTerm) ||
        property.area.toString().includes(searchTerm)
      );
    });
  }, [properties, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const selectedProperty = properties.find(
    (property) => property.id === selectedPropertyId
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Property
  ) => {
    if (selectedPropertyId !== null) {
      handlePropertyChange(selectedPropertyId, { [field]: e.target.value });
    }
  };

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
                      <GalleryVerticalEnd className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleSortChange("price")}
                      >
                        Price
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange("area")}
                      >
                        Area
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange("bedrooms")}
                      >
                        Bedrooms
                      </DropdownMenuItem>
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
              value={searchQuery}
              onChange={handleSearchChange}
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
                onClick={() => setSelectedPropertyId(property.id)}
                className={`flex flex-col rounded-lg border bg-white shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedPropertyId === property.id
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
                    ${property.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {property.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.area} sq ft</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
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
