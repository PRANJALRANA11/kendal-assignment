import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  FeatureGroup,
} from "react-leaflet";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import { MapComponentProps, Property } from "@/lib/types";

const customIcon = new L.Icon({
  iconUrl:
    "https://img.icons8.com/?size=100&id=mtertIv8UKfN&format=png&color=000000",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl:
    "https://img.icons8.com/?size=100&id=Ln7jSgbyMI2J&format=png&color=000000",
  iconSize: [40, 41],
  iconAnchor: [12, 41],
});

// TO control the bevaiour of map
const MapController: React.FC<{
  selectedPropertyId: string | null;
  properties: Property[];
  filteredProperties: Property[];
}> = ({ selectedPropertyId, properties, filteredProperties }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPropertyId) {
      const property = properties.find((p) => p.$id === selectedPropertyId);
      if (
        property &&
        filteredProperties.some((fp) => fp.$id === selectedPropertyId)
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
  drawnPolygon,
  setDrawnPolygon,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>(Object.create(null));

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
  }, [properties, searchQuery, filters, drawnPolygon]);

  const handleDrawCreated = (e: any) => {
    const layer = e.layer;

    // Remove previous polygon if it exists
    if (drawnPolygon) {
      drawnPolygon.remove();
    }

    // Store the new polygon
    if (layer instanceof L.Polygon) {
      setDrawnPolygon(layer);
    }
  };

  const handleDrawDeleted = () => {
    setDrawnPolygon(null);
  };

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
        className="h-full w-full z-0"
        ref={mapRef}
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleDrawCreated}
            onDeleted={handleDrawDeleted}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
            }}
          />
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
              key={property.$id}
              position={[property.latitude, property.longitude]}
              ref={(marker) => {
                if (marker) markerRefs.current[property.$id] = marker;
              }}
              eventHandlers={{
                click: () => setSelectedPropertyId(property.$id),
              }}
              icon={
                selectedPropertyId === property.$id ? selectedIcon : customIcon
              }
            >
              <Popup className="property-popup">
                <div className="max-w-xs">
                  <img
                    src={property.image || ""}
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
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default MapView;
