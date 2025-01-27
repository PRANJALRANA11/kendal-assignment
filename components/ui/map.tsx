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

interface MapComponentProps {
  properties: Property[];
  selectedPropertyId: number | null;
  setSelectedPropertyId: (id: number | null) => void;
  searchQuery: string;
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
      // Only zoom to selected property if it's in the filtered results
      if (
        property &&
        filteredProperties.some((fp) => fp.id === selectedPropertyId)
      ) {
        map.setView([property.latitude, property.longitude], 16, {
          animate: true,
        });
      } else if (filteredProperties.length > 0) {
        // If selected property is not in filtered results, show all filtered properties
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
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<number, L.Marker>>(Object.create(null));

  // Filter properties based on search query
  const filteredProperties = useMemo(() => {
    if (!searchQuery) return properties;

    const searchTerm = searchQuery.toLowerCase();
    return properties.filter(
      (property) =>
        property.name.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.propertyType.toLowerCase().includes(searchTerm) ||
        property.price.toString().includes(searchTerm) ||
        property.bedrooms.toString().includes(searchTerm) ||
        property.bathrooms.toString().includes(searchTerm) ||
        property.area.toString().includes(searchTerm)
    );
  }, [properties, searchQuery]);

  // Deselect property if it's not in filtered results
  useEffect(() => {
    if (
      selectedPropertyId &&
      !filteredProperties.some((p) => p.id === selectedPropertyId)
    ) {
      setSelectedPropertyId(null);
    }
  }, [filteredProperties, selectedPropertyId, setSelectedPropertyId]);

  useEffect(() => {
    if (selectedPropertyId !== null) {
      const property = properties.find((p) => p.id === selectedPropertyId);
      if (
        property &&
        mapRef.current &&
        filteredProperties.some((fp) => fp.id === selectedPropertyId)
      ) {
        mapRef.current.setView([property.latitude, property.longitude], 15, {
          animate: true,
        });

        const marker = markerRefs.current[selectedPropertyId];
        if (marker) {
          marker.openPopup();
        }
      }
    }
  }, [selectedPropertyId, properties, filteredProperties]);

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
