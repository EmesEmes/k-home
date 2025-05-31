import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface FlatMapProps {
  lat: number;
  lng: number;
}



const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const FlatMap: React.FC<FlatMapProps> = ({ lat, lng }) => {
  
  return (
    <MapContainer center={[lat, lng]} zoom={12} className="h-96 w-full rounded-lg shadow-md">
       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} icon={customIcon} />
    </MapContainer>
  );
};

export default FlatMap;