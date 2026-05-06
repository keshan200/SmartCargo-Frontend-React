import { useEffect, useMemo, useState } from "react";
import { Icon } from "../components/shipment/Ui";
import Map from "../components/Map";
import type { Shipment } from "../types/shipment";
import { HUB_COORDS, HUB_NAMES } from "../components/shipment/Constants";

const SAMPLE_SHIPMENTS: Shipment[] = [
  {
    _id: "1",
    tracking_id: "SC-1001",
    sender_id: "SENDER-001",
    sender_name: "Nimali Perera",
    sender_email: "nimali@example.com",
    sender_phone: "+94 77 123 4567",
    sender_address: "34 Kandy Road",
    sender_city: "Kandy",
    sender_postal_code: "20000",
    receiver_name: "Gihan Silva",
    receiver_email: "gihan@example.com",
    receiver_phone: "+94 71 987 6543",
    receiver_address: "No. 2, Main Street",
    receiver_city: "Colombo",
    receiver_postal_code: "00100",
    package_type: "PARCEL",
    weight_kg: 8,
    dimensions: { length: 30, width: 28, height: 18 },
    service_type: "EXPRESS",
    payment_method: "ONLINE",
    current_hub_id: "69de3845f456dec19be397dd",
    delivery_lat: 6.9271,
    delivery_lng: 79.8612,
    status: "IN_TRANSIT",
    created_at: "2026-05-04T09:15:00.000Z",
    total_price: 1920,
  },
  {
    _id: "2",
    tracking_id: "SC-1002",
    sender_id: "SENDER-002",
    sender_name: "Chamila Fernando",
    sender_email: "chamila@example.com",
    sender_phone: "+94 76 314 7852",
    sender_address: "13 Galle Road",
    sender_city: "Colombo",
    sender_postal_code: "00300",
    receiver_name: "Dilani Jayawardena",
    receiver_email: "dilani@example.com",
    receiver_phone: "+94 71 654 3210",
    receiver_address: "18 Beach Avenue",
    receiver_city: "Galle",
    receiver_postal_code: "80000",
    package_type: "DOCUMENT",
    weight_kg: 1,
    dimensions: { length: 18, width: 12, height: 2 },
    service_type: "STANDARD",
    payment_method: "CASH_ON_DELIVERY",
    current_hub_id: "69de3845f456dec19be397df",
    delivery_lat: 6.0535,
    delivery_lng: 80.2210,
    status: "PENDING",
    created_at: "2026-05-03T13:45:00.000Z",
    total_price: 550,
  },
  {
    _id: "3",
    tracking_id: "SC-1003",
    sender_id: "SENDER-003",
    sender_name: "Samantha Rajapaksa",
    sender_email: "samantha@example.com",
    sender_phone: "+94 70 556 9871",
    sender_address: "45 Nuwara Eliya Street",
    sender_city: "Nuwara Eliya",
    sender_postal_code: "22200",
    receiver_name: "Ashoka Perera",
    receiver_email: "ashoka@example.com",
    receiver_phone: "+94 77 444 3322",
    receiver_address: "19 Park Lane",
    receiver_city: "Kurunegala",
    receiver_postal_code: "60000",
    package_type: "HEAVY",
    weight_kg: 22,
    dimensions: { length: 42, width: 35, height: 24 },
    service_type: "OVERNIGHT",
    payment_method: "CARD",
    current_hub_id: "69de3845f456dec19be397e1",
    delivery_lat: 7.4863,
    delivery_lng: 80.3647,
    status: "IN_TRANSIT",
    created_at: "2026-05-05T06:25:00.000Z",
    total_price: 3240,
  },
];

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const TrackingPage = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/shipments");
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) throw new Error("No data");
        if (!active) return;
        setShipments(data);
        setSelectedShipment(data[0] ?? null);
      } catch {
        if (!active) return;
        setShipments(SAMPLE_SHIPMENTS);
        setSelectedShipment(SAMPLE_SHIPMENTS[0]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredShipments = useMemo(
    () => shipments.filter((shipment) =>
      shipment.tracking_id.toLowerCase().includes(query.trim().toLowerCase()) ||
      shipment.receiver_city.toLowerCase().includes(query.trim().toLowerCase()) ||
      shipment.sender_name.toLowerCase().includes(query.trim().toLowerCase())
    ),
    [query, shipments]
  );

  const activeShipment = selectedShipment ?? filteredShipments[0] ?? null;
  const hubCoords = activeShipment?.current_hub_id
    ? HUB_COORDS[activeShipment.current_hub_id]
    : null;
  const routeTo = activeShipment && activeShipment.delivery_lat !== null && activeShipment.delivery_lng !== null
    ? { lat: activeShipment.delivery_lat, lng: activeShipment.delivery_lng }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-1xl font-bold text-gray-900">Live Tracking</h1>
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">
              Monitor active shipments in real time. Search by tracking ID, receiver city, or sender name and view the current route.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon.Search />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shipment..."
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h2 className="text-md font-semibold text-gray-900">Route Preview</h2>
                <p className="text-sm text-gray-500 mt-1">Tap a shipment from the list to update the map.</p>
              </div>
              <div className="h-[520px] p-6">
                {activeShipment ? (
                  <Map
                    hubCoords={hubCoords}
                    hubName={hubCoords ? HUB_NAMES[activeShipment.current_hub_id] ?? "Hub" : "Hub"}
                    routeFrom={hubCoords ?? undefined}
                    routeTo={routeTo ?? undefined}
                    lat={routeTo?.lat}
                    lng={routeTo?.lng}
                    height="100%"
                    readOnly
                  />
                ) : (
                  <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-orange-200 bg-orange-50 text-center text-orange-700">
                    No shipment selected.
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h2 className="text-md font-semibold text-gray-900">Active Shipments</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-6 text-sm text-gray-500">Loading shipments…</div>
                ) : filteredShipments.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500">No shipments match your search.</div>
                ) : (
                  filteredShipments.map((shipment) => (
                    <button
                      key={shipment._id}
                      type="button"
                      onClick={() => setSelectedShipment(shipment)}
                      className={`w-full text-left px-6 py-4 transition ${
                        activeShipment?._id === shipment._id ? "bg-orange-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{shipment.tracking_id}</p>
                          <p className="text-xs text-gray-500">{shipment.receiver_city} • {shipment.sender_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                            {statusLabel[shipment.status] ?? shipment.status}
                          </span>
                          <span className="text-xs text-gray-400">{new Date(shipment.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-md font-semibold text-gray-900">Shipment details</h2>
              {activeShipment ? (
                <div className="mt-4 space-y-4 text-xs text-gray-600">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Tracking ID</p>
                    <p className="mt-2 font-semibold text-gray-900">{activeShipment.tracking_id}</p>
                  </div>
                  <div className="grid gap-3 text-xs">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Route</p>
                      <p className="mt-1 text-gray-900">{HUB_NAMES[activeShipment.current_hub_id] ?? "Origin hub"} → {activeShipment.receiver_city}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Delivery address</p>
                      <p className="mt-1 text-gray-900">{activeShipment.receiver_address}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Receiver</p>
                      <p className="mt-1 text-gray-900">{activeShipment.receiver_name}</p>
                      <p className="text-[10px] text-gray-500">{activeShipment.receiver_phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Package</p>
                      <p className="mt-1 text-gray-900">{activeShipment.package_type} • {activeShipment.weight_kg} kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Current status</p>
                      <p className="mt-1 font-semibold text-orange-600">{statusLabel[activeShipment.status] ?? activeShipment.status}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-gray-500">Select a shipment to see details and live route updates.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
