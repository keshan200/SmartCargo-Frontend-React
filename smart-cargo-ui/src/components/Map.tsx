import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useAuth } from '../context/useAuth';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function createHubIcon(hubName: string): L.DivIcon {
  return L.divIcon({
    className: '',
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
          <path d="M16 0C9.37 0 4 5.37 4 12c0 9 12 30 12 30S28 21 28 12C28 5.37 22.63 0 16 0z"
                fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
          <circle cx="16" cy="12" r="5" fill="white"/>
        </svg>
        <div style="
          background: #f97316;
          color: white;
          font-size: 10px;
          font-weight: 700;
          font-family: sans-serif;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          letter-spacing: 0.3px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        ">${hubName}</div>
      </div>
    `,
  });
}

const SL_BOUNDS = L.latLngBounds(
  L.latLng(5.85, 79.5),
  L.latLng(9.9, 81.9)
);

const SL_CENTER: [number, number] = [7.8731, 80.7718];
const SL_ZOOM = 7;
const HUB_ZOOM = 13;

interface CargoMapProps {
  lat?: number;
  lng?: number;
  height?: string;
  readOnly?: boolean;
  onChange?: (lat: number, lng: number) => void;
  routeFrom?: { lat: number; lng: number };
  routeTo?: { lat: number; lng: number };
  hubCoords?: { lat: number; lng: number } | null;
  hubName?: string;
}

function ClickHandler({ onChange }: { onChange?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onChange) onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Delivery pin select කළාම ඒ location ේ fly කරයි
function MapUpdater({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], HUB_ZOOM, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
}

// ── NEW: Hub location ේ map focus කරයි (delivery pin නැතිවිට) ──────────────
function MapFocusHub({
  hub,
  hasDelivery,
}: {
  hub: { lat: number; lng: number } | null;
  hasDelivery: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    // delivery pin already selected නම් ඒකෙට priority දෙනවා
    if (!hub || hasDelivery) return;
    map.flyTo([hub.lat, hub.lng], HUB_ZOOM, { duration: 1.5 });
  }, [hub?.lat, hub?.lng, hasDelivery]);   // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

function RoutingControl({
  from,
  to,
  hubName,
}: {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  hubName: string;
}) {
  const map = useMap();
  const controlRef = useRef<L.Routing.Control | null>(null);
  const hubIcon = React.useMemo(() => createHubIcon(hubName), [hubName]);

  useEffect(() => {
    if (controlRef.current) {
      try { map.removeControl(controlRef.current); } catch (_) {}
      controlRef.current = null;
    }

    controlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
      lineOptions: {
        styles: [{ color: '#f97316', weight: 4, opacity: 0.85 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      collapsible: true,
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
      createMarker: () => (null as unknown as L.Marker),
    }).addTo(map);

    controlRef.current.on('routesfound', () => {
      const el = (controlRef.current as any)?._container as HTMLElement | undefined;
      if (el) el.style.display = 'none';
    });

    return () => {
      if (controlRef.current) {
        try { map.removeControl(controlRef.current); } catch (_) {}
        controlRef.current = null;
      }
    };
  }, [map, from.lat, from.lng, to.lat, to.lng, hubIcon]);

  return null;
}

const CargoMap: React.FC<CargoMapProps> = ({
  lat,
  lng,
  height = '400px',
  readOnly = false,
  onChange,
  routeFrom,
  routeTo,
  hubCoords: hubCoordsFromProps,
  hubName = 'Hub',
}) => {
  const { user } = useAuth();

  // Props → auth user hub → null  (priority order)
  const hubCoords = hubCoordsFromProps ?? user?.hub ?? null;

  const hasPin = !!(lat && lng);
  const position: [number, number] | undefined = hasPin ? [lat!, lng!] : undefined;
  const showRoute = !!(routeFrom && routeTo);

  const hubIcon = React.useMemo(() => createHubIcon(hubName), [hubName]);

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={
          // Map mount වෙන විට hub location ේ center කරයි (available නම්
          hubCoords
            ? [hubCoords.lat, hubCoords.lng]
            : SL_CENTER
        }
        zoom={hubCoords ? HUB_ZOOM : SL_ZOOM}
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

        {/* Hub marker — always visible */}
        {hubCoords && (
          <Marker position={[hubCoords.lat, hubCoords.lng]} icon={hubIcon}>
            <Popup>🏭 {hubName}</Popup>
          </Marker>
        )}

        {/* Route line */}
        {showRoute && (
          <RoutingControl from={routeFrom!} to={routeTo!} hubName={hubName} />
        )}

        {/* Delivery pin */}
        {position && (
          <Marker position={position}>
            <Popup>
              📍 {showRoute ? 'Delivery: ' : ''}{lat!.toFixed(4)}, {lng!.toFixed(4)}
            </Popup>
          </Marker>
        )}

        {!readOnly && <ClickHandler onChange={onChange} />}

        {/* Delivery select → ඒකෙ fly */}
        <MapUpdater lat={lat} lng={lng} />

        {/* Hub → focus (delivery නැතිවිට) */}
        <MapFocusHub hub={hubCoords} hasDelivery={hasPin} />
      </MapContainer>
    </div>
  );
};

export default React.memo(CargoMap);