"use client";
import React, { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

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

interface PropertyFilters {
  priceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  minArea: number | null;
  propertyType: string | null;
  title: string;
  description: string;
}

interface MapComponentProps {
  properties: Property[];
  selectedPropertyId: number | null;
  setSelectedPropertyId: (id: number | null) => void;
  searchQuery: string;
  filters: PropertyFilters;
}

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapController: React.FC<{
  selectedPropertyId: number | null;
  properties: Property[];
  filteredProperties: Property[];
}> = ({ selectedPropertyId, properties, filteredProperties }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPropertyId) {
      const property = properties.find((p) => p.id === selectedPropertyId);
      if (
        property &&
        filteredProperties.some((fp) => fp.id === selectedPropertyId)
      ) {
        map.setView([property.latitude, property.longitude], 16, {
          animate: true,
        });
      } else if (filteredProperties.length > 0) {
        const bounds = L.latLngBounds(
          filteredProperties.map((p) => [p.latitude, p.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else if (filteredProperties.length > 0) {
      const bounds = L.latLngBounds(
        filteredProperties.map((p) => [p.latitude, p.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedPropertyId, properties, filteredProperties, map]);

  return null;
};

const MapView: React.FC<MapComponentProps> = ({
  properties,
  selectedPropertyId,
  setSelectedPropertyId,
  searchQuery,
  filters,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<number, L.Marker>>(Object.create(null));

  // Filter properties based on search query and filters
  const filteredProperties = useMemo(() => {
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

      return (
        matchesSearch &&
        matchesPrice &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesArea &&
        matchesType &&
        matchesTitle &&
        matchesDescription
      );
    });
  }, [properties, searchQuery, filters]);

  // Deselect property if it's not in filtered results
  useEffect(() => {
    if (
      selectedPropertyId &&
      !filteredProperties.some((p) => p.id === selectedPropertyId)
    ) {
      setSelectedPropertyId(null);
    }
  }, [filteredProperties, selectedPropertyId, setSelectedPropertyId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="relative h-screen">
      <MapContainer
        center={[37.7749, -122.4194]}
        zoom={13}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController
          selectedPropertyId={selectedPropertyId}
          properties={properties}
          filteredProperties={filteredProperties}
        />

        {filteredProperties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            ref={(marker) => {
              if (marker) markerRefs.current[property.id] = marker;
            }}
            eventHandlers={{
              click: () => setSelectedPropertyId(property.id),
            }}
            icon={
              selectedPropertyId === property.id ? selectedIcon : customIcon
            }
          >
            <Popup className="property-popup">
              <div className="max-w-xs">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <p className="text-primary font-medium">
                    {formatPrice(property.price)}
                  </p>
                  <div className="flex gap-3 text-sm text-gray-600 mt-2">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.area} sq ft</span>
                  </div>
                  <p className="text-sm mt-2 text-gray-600">
                    {property.description}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
