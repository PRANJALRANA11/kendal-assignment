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
  propertyType: string;
  area: number;
}

interface MapComponentProps {
  properties: Property[];
  selectedPropertyId: number | null;
  setSelectedPropertyId: (id: number | null) => void;
}

// Define custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Helper component to handle map interactions
const MapController: React.FC<{
  selectedPropertyId: number | null;
  properties: Property[];
}> = ({ selectedPropertyId, properties }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPropertyId) {
      const property = properties.find((p) => p.id === selectedPropertyId);
      if (property) {
        map.setView([property.latitude, property.longitude], 16, {
          animate: true,
        });
      }
    }
  }, [selectedPropertyId, properties, map]);

  return null;
};

const MapView: React.FC<MapComponentProps> = ({
  properties,
  selectedPropertyId,
  setSelectedPropertyId,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<number, L.Marker>>(Object.create(null));

  useEffect(() => {
    if (selectedPropertyId !== null) {
      const property = properties.find((p) => p.id === selectedPropertyId);
      if (property && mapRef.current) {
        mapRef.current.setView([property.latitude, property.longitude], 15, {
          animate: true,
        });

        // Open popup for the selected marker
        const marker = markerRefs.current[selectedPropertyId];
        if (marker) {
          marker.openPopup();
        }
      }
    }
  }, [selectedPropertyId, properties]);

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
          selectedPropertyId={selectedPropertyId}
          properties={properties}
        />

        {/* Markers */}
        {properties.map((property) => (
          <Marker
            key={property.id} // Use unique property ID as key
            position={[property.latitude, property.longitude]}
            ref={(marker) => {
              if (marker) markerRefs.current[property.id] = marker;
            }}
            eventHandlers={{
              click: () => setSelectedPropertyId(property.id),
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
