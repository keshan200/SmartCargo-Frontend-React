import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Fix default icon paths ──────────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom orange teardrop pin ──────────────────────────────────────────────
const orangePin = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 28px; height: 28px;
      background: #f97316;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid #fff;
      box-shadow: 0 4px 14px rgba(249,115,22,0.55);
    "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

// ── Sub-component: re-center map when lat/lng prop changes ──────────────────
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], map.getZoom());
  }, [lat, lng]);
  return null;
}

// ── Sub-component: click handler (only when editable) ──────────────────────
function ClickHandler({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onChange(
        parseFloat(e.latlng.lat.toFixed(6)),
        parseFloat(e.latlng.lng.toFixed(6))
      );
    },
  });
  return null;
}

// ── Main exported component ─────────────────────────────────────────────────
interface LeafletMapProps {
  lat: number;
  lng: number;
  onChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
  height?: string | number;
}

export default function LeafletMap({
  lat,
  lng,
  onChange,
  readOnly = false,
  height = "100%",
}: LeafletMapProps) {
  const defaultCenter: [number, number] = lat && lng ? [lat, lng] : [7.8731, 80.7718];
  const defaultZoom = lat && lng ? 13 : 7;

  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 16,
        overflow: "hidden",
        border: "1.5px solid #ffe0c8",
        boxShadow: "0 4px 24px rgba(249,115,22,0.08)",
      }}
    >
      {/* Inject Leaflet tile layer attribution style tweak */}
      <style>{`
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.85) !important;
          font-size: 10px !important;
          color: #aaa !important;
        }
        .leaflet-control-zoom a {
          color: #f97316 !important;
          border-color: #ffe0c8 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #fff4ed !important;
        }
        .leaflet-bar {
          border: 1.5px solid #ffe0c8 !important;
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(249,115,22,0.1) !important;
        }
        ${!readOnly ? "* { cursor: crosshair !important; } .leaflet-control-zoom a { cursor: pointer !important; }" : ""}
      `}</style>

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Re-center whenever coords change */}
        {lat && lng && <RecenterMap lat={lat} lng={lng} />}

        {/* Click to place pin (edit mode) */}
        {!readOnly && onChange && <ClickHandler onChange={onChange} />}

        {/* Marker */}
        {lat !== 0 && lng !== 0 && (
          <Marker position={[lat, lng]} icon={orangePin} />
        )}
      </MapContainer>
    </div>
  );
}