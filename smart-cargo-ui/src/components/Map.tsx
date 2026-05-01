import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Hub marker — orange pin
const HubIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Sri Lanka bounding box
const SL_BOUNDS = L.latLngBounds(
  L.latLng(5.85, 79.5),
  L.latLng(9.9, 81.9)
);

const SL_CENTER: [number, number] = [7.8731, 80.7718];
const SL_ZOOM = 7;

interface CargoMapProps {
  lat?: number;
  lng?: number;
  height?: string;
  readOnly?: boolean;
  onChange?: (lat: number, lng: number) => void;

  // Route: hub → delivery pin
  routeFrom?: { lat: number; lng: number };
  routeTo?:   { lat: number; lng: number };
}

// ─── Click Handler ────────────────────────────────────────────────────────────
function ClickHandler({ onChange }: { onChange?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onChange) onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ─── Fly-to updater ───────────────────────────────────────────────────────────
function MapUpdater({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 13, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
}

// ─── Routing Machine Control ──────────────────────────────────────────────────
function RoutingControl({
  from,
  to,
}: {
  from: { lat: number; lng: number };
  to:   { lat: number; lng: number };
}) {
  const map = useMap();
  const controlRef = useRef<L.Routing.Control | null>(null);

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
      createMarker: (i: number, wp: L.Routing.Waypoint) => {
        return L.marker(wp.latLng, { icon: i === 0 ? HubIcon : DefaultIcon });
      },
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
  }, [map, from.lat, from.lng, to.lat, to.lng]);

  return null;
}

// ─── Main Map Component ───────────────────────────────────────────────────────
const CargoMap: React.FC<CargoMapProps> = ({
  lat,
  lng,
  height = '400px',
  readOnly = false,
  onChange,
  routeFrom,
  routeTo,
}) => {
  const hasPin = lat && lng;
  const position: [number, number] | undefined = hasPin ? [lat!, lng!] : undefined;
  const showRoute = !!(routeFrom && routeTo);

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

        {/* Route: hub → delivery pin via leaflet-routing-machine */}
        {showRoute && (
          <RoutingControl from={routeFrom!} to={routeTo!} />
        )}

        {/* Delivery pin — only shown when NO routing (routing adds its own markers) */}
        {position && !showRoute && (
          <Marker position={position}>
            <Popup>{lat!.toFixed(4)}, {lng!.toFixed(4)}</Popup>
          </Marker>
        )}

        {/* Delivery pin label when routing is active */}
        {position && showRoute && (
          <Marker position={position}>
            <Popup>📍 Delivery: {lat!.toFixed(4)}, {lng!.toFixed(4)}</Popup>
          </Marker>
        )}

        {!readOnly && <ClickHandler onChange={onChange} />}
        <MapUpdater lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
};

export default React.memo(CargoMap);