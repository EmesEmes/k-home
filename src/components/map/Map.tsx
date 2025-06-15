import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvent, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router";
import FlatGallery from "../flatGallery/FlatGallery";

// Tipo de un flat
interface Flat {
  id?: string;
  title?: string;
  lat: number;
  lng: number;
}

// Props del componente
interface FlatMapProps {
  center: { lat: number; lng: number };    
  flats?: Flat[];
  singleMarker?: boolean;
  onClick?: (coords: { lat: number; lng: number }) => void;
  zoom?: number;
}

// Ícono personalizado
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Componente para manejar clicks en el mapa
function ClickHandler({ onClick }: { onClick: (coords: { lat: number; lng: number }) => void }) {
  useMapEvent("click", (e) => {
    onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
}

// Componente principal del mapa
const FlatMap: React.FC<FlatMapProps> = ({ center, flats = [], singleMarker = false, onClick, zoom }) => {
  console.log("FlatMap props:", { center, flats });

  if (!center) {
    return <p>Error: El centro del mapa no está definido.</p>;
  }
  return (
    <MapContainer
      center={[center.lat, center.lng]} 
      zoom={zoom}
      className="h-[700px] w-full rounded-lg shadow-md"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {singleMarker ? (
        <Marker position={[center.lat, center.lng]} icon={customIcon}>
          <Popup>Ubicación seleccionada</Popup>
        </Marker>
      ) : (
        flats.map((flat, idx) => (
          <Marker key={flat._id ?? idx} position={[flat.latitude, flat.longitude]} icon={customIcon}>
            <Popup className="w-[312px]">
              <div >
                <div className="mb-2">
                  <FlatGallery images={flat.images}/>

                </div>
                <div className="font-bold">{flat.streetName}</div>
                <div className="mb-4">${flat.rentPrice}</div>
                <div>
                  <Link to={`/flat/${flat._id}`} className="bg-primary p-2 rounded-lg">
                  <span className="text-white">View</span>
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))
      )}

      {onClick && <ClickHandler onClick={onClick} />}
    </MapContainer>
  );
};

export default FlatMap;
