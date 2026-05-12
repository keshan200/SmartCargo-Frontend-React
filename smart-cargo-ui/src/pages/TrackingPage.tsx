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

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_STEPS = ["PENDING", "IN_TRANSIT", "DELIVERED"] as const;
const statusMeta: Record<string, { label: string; color: string; bg: string; dot: string; step: number }> = {
  PENDING:    { label: "Pending",    color: "text-amber-600",  bg: "bg-amber-50  border-amber-200",  dot: "bg-amber-400",  step: 0 },
  IN_TRANSIT: { label: "In Transit", color: "text-orange-600", bg: "bg-orange-50 border-orange-200", dot: "bg-orange-500", step: 1 },
  DELIVERED:  { label: "Delivered",  color: "text-green-600",  bg: "bg-green-50  border-green-200",  dot: "bg-green-500",  step: 2 },
  CANCELLED:  { label: "Cancelled",  color: "text-red-500",    bg: "bg-red-50    border-red-200",    dot: "bg-red-400",    step: -1 },
};

const serviceIcon: Record<string, string> = {
  STANDARD:  "📦",
  EXPRESS:   "⚡",
  OVERNIGHT: "🌙",
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const StatusProgress = ({ status }: { status: string }) => {
  const meta = statusMeta[status];
  const step = meta?.step ?? 0;
  const steps = [
    { key: "PENDING",    label: "Picked Up",  icon: "📋" },
    { key: "IN_TRANSIT", label: "In Transit", icon: "🚚" },
    { key: "DELIVERED",  label: "Delivered",  icon: "✅" },
  ];

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((s, i) => {
        const done    = step > i;
        const active  = step === i;
        const last    = i === steps.length - 1;
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                done   ? "bg-orange-500 border-orange-500 text-white" :
                active ? "bg-white border-orange-400 text-orange-500 shadow-md shadow-orange-100" :
                         "bg-white border-gray-200 text-gray-300"
              }`}>
                {done ? "✓" : s.icon}
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap ${
                done || active ? "text-orange-600" : "text-gray-400"
              }`}>{s.label}</span>
            </div>
            {!last && (
              <div className={`flex-1 h-0.5 mb-4 mx-1 rounded-full ${done ? "bg-orange-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const TrackingPage = () => {
  const [shipments, setShipments]           = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [query, setQuery]                   = useState("");
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res  = await fetch("/api/shipments");
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
    return () => { active = false; };
  }, []);

  const filteredShipments = useMemo(
    () => shipments.filter(s =>
      s.tracking_id.toLowerCase().includes(query.trim().toLowerCase()) ||
      s.receiver_city.toLowerCase().includes(query.trim().toLowerCase()) ||
      s.sender_name.toLowerCase().includes(query.trim().toLowerCase())
    ),
    [query, shipments]
  );

  const active     = selectedShipment ?? filteredShipments[0] ?? null;
  const hubCoords  = active?.current_hub_id ? HUB_COORDS[active.current_hub_id] : null;
  const routeTo    = active?.delivery_lat != null && active?.delivery_lng != null
    ? { lat: active.delivery_lat, lng: active.delivery_lng } : undefined;
  const meta       = active ? (statusMeta[active.status] ?? statusMeta.PENDING) : null;

  return (
    <div
      className="flex font-['Poppins',sans-serif] bg-gray-50"
      style={{ height: "calc(100vh - 64px)" }}   // adjust 64px to your navbar height
    >
      {/* ── LEFT: Map (fills remaining space) ─────────────────────────────── */}
      <div className="relative flex-1 min-w-0">
        {/* Floating map label */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
          <span className="text-orange-500 text-sm">🗺️</span>
          <div>
            <p className="text-xs font-semibold text-gray-800 leading-tight">Route Preview</p>
            {active && (
              <p className="text-[10px] text-gray-400 leading-tight">
                {HUB_NAMES[active.current_hub_id] ?? "Hub"} → {active.receiver_city}
              </p>
            )}
          </div>
        </div>

        {active ? (
          <Map
            key={active._id}
            hubCoords={hubCoords}
            hubName={hubCoords ? HUB_NAMES[active.current_hub_id] ?? "Hub" : "Hub"}
            routeFrom={hubCoords ?? undefined}
            routeTo={routeTo}
            lat={routeTo?.lat}
            lng={routeTo?.lng}
            height="100%"
            readOnly
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-orange-50 text-orange-400 text-sm">
            No shipment selected.
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────────── */}
      <div className="w-[380px] shrink-0 flex flex-col bg-white border-l border-gray-100 shadow-xl overflow-hidden">

        {/* Search */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Track Shipment</p>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon.Search />
            </span>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ID, city or sender name…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Shipment list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {loading ? (
            <div className="p-6 text-sm text-gray-400 text-center">Loading shipments…</div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-6 text-sm text-gray-400 text-center">No shipments found.</div>
          ) : (
            filteredShipments.map(s => {
              const sm      = statusMeta[s.status] ?? statusMeta.PENDING;
              const isActive = active?._id === s._id;
              return (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => setSelectedShipment(s)}
                  className={`w-full text-left px-4 py-3.5 transition-all group ${
                    isActive ? "bg-orange-50 border-l-2 border-orange-400" : "hover:bg-gray-50 border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-orange-600 font-mono">{s.tracking_id}</span>
                        <span className="text-sm">{serviceIcon[s.service_type] ?? "📦"}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {s.sender_name} → {s.receiver_city}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(s.created_at).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}{s.weight_kg} kg
                      </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${sm.bg} ${sm.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                        {sm.label}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">Rs. {s.total_price.toLocaleString()}</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail panel for selected shipment */}
        {active && meta && (
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-4 shrink-0">

            {/* Status progress */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Delivery Progress</p>
              <StatusProgress status={active.status} />
            </div>

            {/* Key details grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Receiver",  value: active.receiver_name },
                { label: "Phone",     value: active.receiver_phone },
                { label: "Package",   value: `${active.package_type} · ${active.weight_kg} kg` },
                { label: "Service",   value: active.service_type },
                { label: "Hub",       value: HUB_NAMES[active.current_hub_id] ?? active.current_hub_id },
                { label: "Total",     value: `Rs. ${active.total_price.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="text-xs font-semibold text-gray-800 truncate" title={value}>{value}</p>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl px-3 py-2.5 border border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
              <p className="text-xs text-gray-700">{active.receiver_address}, {active.receiver_city} {active.receiver_postal_code}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;