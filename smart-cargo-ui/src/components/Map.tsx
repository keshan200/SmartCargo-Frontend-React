import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sri Lanka bounding box
const SL_BOUNDS = L.latLngBounds(
  L.latLng(5.85, 79.5),  // South-West
  L.latLng(9.9, 81.9)   // North-East
);

const SL_CENTER: [number, number] = [7.8731, 80.7718];
const SL_ZOOM = 7;

interface CargoMapProps {
  lat?: number;
  lng?: number;
  height?: string;
  readOnly?: boolean;
  onChange?: (lat: number, lng: number) => void;
}

function ClickHandler({ onChange }: { onChange?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onChange) {
        onChange(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function MapUpdater({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 13, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
}

const CargoMap: React.FC<CargoMapProps> = ({
  lat,
  lng,
  height = '400px',
  readOnly = false,
  onChange,
}) => {
  const hasPin = lat && lng;
  const position: [number, number] | undefined = hasPin ? [lat!, lng!] : undefined;

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={SL_CENTER}
        zoom={SL_ZOOM}
        minZoom={6}
        maxZoom={18}
        maxBounds={SL_BOUNDS}
        maxBoundsViscosity={0.85}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position && (
          <Marker position={position}>
            <Popup>
              {lat!.toFixed(4)}, {lng!.toFixed(4)}
            </Popup>
          </Marker>
        )}

        {!readOnly && <ClickHandler onChange={onChange} />}
        <MapUpdater lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
};

export default CargoMap;