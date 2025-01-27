"use client";
import React, { useEffect, useRef } from "react";
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
  area: number;
  propertyType: string;
}

interface MapComponentProps {
  properties: Property[];
  selectedProperty: string | null;
  onPropertySelect: (propertyId: string) => void;
}

// Define marker icons
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapComponentProps {
  properties: Property[];
  selectedProperty: string | null;
  onPropertySelect: (propertyId: string) => void;
}

// Helper component to handle map interactions
const MapController: React.FC<{
  selectedProperty: string | null;
  properties: Property[];
}> = ({ selectedProperty, properties }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      const property = properties.find((p) => p.id === selectedProperty);
      if (property) {
        map.setView([property.latitude, property.longitude], 16, {
          animate: true,
        });
      }
    }
  }, [selectedProperty, properties, map]);

  return null;
};

const MapView: React.FC<MapComponentProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<number, L.Marker>>(Object.create(null));

  useEffect(() => {
    if (selectedProperty !== null && mapRef.current) {
      const property = properties.find((p) => p.id === selectedProperty);
      if (property) {
        mapRef.current.setView([property.latitude, property.longitude], 15); // Focus map on marker
        const marker = markerRefs.current[selectedProperty];
        if (marker) {
          marker.openPopup(); // Open the popup
        }
      }
    }
  }, [selectedProperty]);

  return (
    <div style={{ flex: 1 }}>
      <MapContainer
        center={[37.7749, -122.4194]} // Initial center coordinates
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
        ref={mapRef}
      >
        {/* Map Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController
          selectedProperty={selectedProperty}
          properties={properties}
        />

        {/* Markers */}
        {properties.map((property, index) => (
          <Marker
            key={`${property.id}-${index}`} // Combines id and index for uniqueness
            position={[property.latitude, property.longitude]}
            ref={(marker) => {
              if (marker) markerRefs.current[property.id] = marker;
            }}
            eventHandlers={{
              click: () => onPropertySelect(property.id),
            }}
            icon={customIcon}
          >
            <Popup>
              <div style={{ textAlign: "center" }}>
                <h3>{property.name}</h3>
                <p>{property.description}</p>
                <img
                  src={property.image}
                  alt={property.name}
                  style={{ width: "100%", borderRadius: "5px" }}
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
