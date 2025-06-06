// src/components/Map.tsx (antes: FlatMap.tsx)
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface FlatMapProps {
  lat: number;
  lng: number;
  onClick?: (coords: { lat: number; lng: number }) => void;
}

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


function ClickHandler({
  onClick,
}: {
  onClick: (coords: { lat: number; lng: number }) => void;
}) {
  
  useMapEvent("click", (e) => {
    onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
}

const FlatMap: React.FC<FlatMapProps> = ({ lat, lng, onClick }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={12}
      className="h-96 w-full rounded-lg shadow-md"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


      <Marker position={[lat, lng]} icon={customIcon} />

    
      {onClick && <ClickHandler onClick={onClick} />}
    </MapContainer>
  );
};

export default FlatMap;
