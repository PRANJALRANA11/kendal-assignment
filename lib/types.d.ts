export interface Property {
  id: string;
  name: string;
  description: string;
  image: string | null;
  latitude: number;
  longitude: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  area: number;
}

type Filters = {
  priceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  minArea: number | null;
  propertyType: string | null;
  title: string;
  description: string;
};

interface PropertySidebarProps {
  properties: Property[];
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  handlePropertyChange: (id: string, updatedData: Partial<Property>) => void;
  sortOption: string;
  handleSortChange: (option: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onSuccess?: (value: boolean) => void;
}

interface PropertyFilters {
  priceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  minArea: number | null;
  propertyType: string | null;
  title: string;
  description: string;
}

interface FilterPanelProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  properties: Property[];
  filters: Filters;
}

interface MapComponentProps {
  properties: Property[];
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  searchQuery: string;
  filters: PropertyFilters;
}

interface PropertyFormProps {
  propertyId: string;
  onSuccess?: (value: boolean) => void
}
