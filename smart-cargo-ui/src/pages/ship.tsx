import { useState, useEffect, useRef, useCallback } from "react";
import CargoMap from "../components/Map";

// ─── Types ────────────────────────────────────────────────────────────────────
export type PackageType = "PARCEL" | "DOCUMENT" | "FRAGILE" | "HEAVY";
export type ServiceType = "STANDARD" | "EXPRESS" | "OVERNIGHT";
export type PaymentMethod = "CASH_ON_DELIVERY" | "ONLINE" | "CARD";
export type ShipmentStatus = "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

interface PackageDimensions { length: number; width: number; height: number }
interface Hub { _id: string; name: string; city: string; address?: string; lat?: number; lng?: number }

interface ShipmentForm {
  sender_id: string;
  receiver_name: string; receiver_email: string; receiver_phone: string;
  receiver_address: string; receiver_city: string; receiver_postal_code: string;
  package_type: PackageType; weight_kg: number | "";
  dimensions: PackageDimensions;
  service_type: ServiceType; payment_method: PaymentMethod;
  current_hub_id: string;
  delivery_lat: number | null; delivery_lng: number | null;
}

export interface Shipment {
  _id: string;
  tracking_id: string;
  sender_id: string;
  receiver_name: string; receiver_email: string; receiver_phone: string;
  receiver_address: string; receiver_city: string; receiver_postal_code: string;
  package_type: PackageType; weight_kg: number;
  dimensions: PackageDimensions;
  service_type: ServiceType; payment_method: PaymentMethod;
  current_hub_id: string;
  delivery_lat: number | null; delivery_lng: number | null;
  status: ShipmentStatus;
  created_at: string;
  total_price: number;
}

// ─── Pricing Config ───────────────────────────────────────────────────────────
export const PricingConfig = {
  base_price: 250,
  price_per_kg: 60,
  price_per_km: 40,
  express_multiplier: 1.5,
};

// ─── Hub coordinates ──────────────────────────────────────────────────────────
const HUB_COORDS: Record<string, { lat: number; lng: number }> = {
  "69de3845f456dec19be397dd": { lat: 6.9271, lng: 79.8612 },
  "69de3845f456dec19be397de": { lat: 7.2906, lng: 80.6337 },
  "69de3845f456dec19be397df": { lat: 6.0535, lng: 80.2210 },
  "69de3845f456dec19be397e0": { lat: 9.6615, lng: 80.0255 },
  "69de3845f456dec19be397e1": { lat: 7.4863, lng: 80.3647 },
};

const HUB_NAMES: Record<string, string> = {
  "69de3845f456dec19be397dd": "Colombo Central Hub",
  "69de3845f456dec19be397de": "Kandy Regional Hub",
  "69de3845f456dec19be397df": "Galle Southern Hub",
  "69de3845f456dec19be397e0": "Jaffna Northern Hub",
  "69de3845f456dec19be397e1": "Kurunegala Hub",
};

// ─── Mock Shipments ───────────────────────────────────────────────────────────
const MOCK_SHIPMENTS: Shipment[] = [
  {
    _id: "s1", tracking_id: "SC-A1B2C3", sender_id: "69de53b1d7389b388eb26a10",
    receiver_name: "Nimna Perera", receiver_email: "nimna@mail.com", receiver_phone: "0771234567",
    receiver_address: "No 25, Peradeniya Road", receiver_city: "Kandy", receiver_postal_code: "20000",
    package_type: "PARCEL", weight_kg: 3.5, dimensions: { length: 30, width: 20, height: 15 },
    service_type: "EXPRESS", payment_method: "ONLINE", current_hub_id: "69de3845f456dec19be397de",
    delivery_lat: 7.2906, delivery_lng: 80.6337, status: "IN_TRANSIT",
    created_at: "2025-04-15T08:30:00Z", total_price: 1250,
  },
  {
    _id: "s2", tracking_id: "SC-D4E5F6", sender_id: "69de53b1d7389b388eb26a10",
    receiver_name: "Kamal Silva", receiver_email: "kamal@mail.com", receiver_phone: "0712345678",
    receiver_address: "45 Galle Road", receiver_city: "Colombo", receiver_postal_code: "00300",
    package_type: "DOCUMENT", weight_kg: 0.5, dimensions: { length: 30, width: 21, height: 1 },
    service_type: "STANDARD", payment_method: "CASH_ON_DELIVERY", current_hub_id: "69de3845f456dec19be397dd",
    delivery_lat: 6.9271, delivery_lng: 79.8612, status: "DELIVERED",
    created_at: "2025-04-10T14:00:00Z", total_price: 480,
  },
  {
    _id: "s3", tracking_id: "SC-G7H8I9", sender_id: "69de53b1d7389b388eb26a11",
    receiver_name: "Sanduni Fernando", receiver_email: "sanduni@mail.com", receiver_phone: "0769876543",
    receiver_address: "12 Beach Road", receiver_city: "Galle", receiver_postal_code: "80000",
    package_type: "FRAGILE", weight_kg: 2.0, dimensions: { length: 25, width: 25, height: 20 },
    service_type: "OVERNIGHT", payment_method: "CARD", current_hub_id: "69de3845f456dec19be397df",
    delivery_lat: 6.0535, delivery_lng: 80.2210, status: "PENDING",
    created_at: "2025-04-18T10:00:00Z", total_price: 1890,
  },
  {
    _id: "s4", tracking_id: "SC-J1K2L3", sender_id: "69de53b1d7389b388eb26a12",
    receiver_name: "Priya Navaratnam", receiver_email: "priya@mail.com", receiver_phone: "0756543210",
    receiver_address: "78 Hospital Road", receiver_city: "Jaffna", receiver_postal_code: "40000",
    package_type: "HEAVY", weight_kg: 12.0, dimensions: { length: 60, width: 40, height: 30 },
    service_type: "STANDARD", payment_method: "ONLINE", current_hub_id: "69de3845f456dec19be397e0",
    delivery_lat: 9.6615, delivery_lng: 80.0255, status: "IN_TRANSIT",
    created_at: "2025-04-17T09:15:00Z", total_price: 2250,
  },
  {
    _id: "s5", tracking_id: "SC-M4N5O6", sender_id: "69de53b1d7389b388eb26a10",
    receiver_name: "Ruwan Jayawardena", receiver_email: "ruwan@mail.com", receiver_phone: "0783332211",
    receiver_address: "34 Kurunegala Road", receiver_city: "Kurunegala", receiver_postal_code: "60000",
    package_type: "PARCEL", weight_kg: 5.5, dimensions: { length: 40, width: 30, height: 25 },
    service_type: "EXPRESS", payment_method: "CARD", current_hub_id: "69de3845f456dec19be397e1",
    delivery_lat: 7.4863, delivery_lng: 80.3647, status: "CANCELLED",
    created_at: "2025-04-12T16:45:00Z", total_price: 1620,
  },
];

// ─── Haversine ────────────────────────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Price Calculator ─────────────────────────────────────────────────────────
function calcPrice(form: ShipmentForm) {
  const w = parseFloat(String(form.weight_kg)) || 0;
  const hubCoord = HUB_COORDS[form.current_hub_id];
  let km = 0;
  if (hubCoord && form.delivery_lat !== null && form.delivery_lng !== null)
    km = haversine(hubCoord.lat, hubCoord.lng, form.delivery_lat, form.delivery_lng);
  const base = PricingConfig.base_price;
  const perKg = w * PricingConfig.price_per_kg;
  const perKm = km * PricingConfig.price_per_km;
  const multiplierApplied = form.service_type === "EXPRESS" || form.service_type === "OVERNIGHT";
  const subtotal = base + perKg + perKm;
  const total = Math.round(multiplierApplied ? subtotal * PricingConfig.express_multiplier : subtotal);
  return { base, perKg: Math.round(perKg), perKm: Math.round(perKm), km: Math.round(km * 10) / 10, total, multiplierApplied };
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Truck: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>),
  Package: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>),
  User: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Card: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>),
  Pin: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  Building: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>),
  Check: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  CheckCircle: () => (<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  Spin: ({ cls }: { cls?: string }) => (<svg className={`animate-spin ${cls ?? "w-4 h-4"}`} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/></svg>),
  ChevronDown: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  Target: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
  Search: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Filter: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>),
  MapIcon: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>),
  Eye: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  X: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  History: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
  Phone: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12 19.79 19.79 0 0 1 1.13 3.4 2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
};

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_STYLE: Record<ShipmentStatus, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:    { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-400",  label: "Pending" },
  IN_TRANSIT: { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-500",   label: "In Transit" },
  DELIVERED:  { bg: "bg-green-50",  text: "text-green-600",  dot: "bg-green-500",  label: "Delivered" },
  CANCELLED:  { bg: "bg-red-50",    text: "text-red-500",    dot: "bg-red-400",    label: "Cancelled" },
};

const StatusBadge = ({ status }: { status: ShipmentStatus }) => {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
};

// ─── Constants ────────────────────────────────────────────────────────────────
const PKG_OPTIONS: { value: PackageType; label: string }[] = [
  { value: "PARCEL", label: "Parcel" }, { value: "DOCUMENT", label: "Document" },
  { value: "FRAGILE", label: "Fragile" }, { value: "HEAVY", label: "Heavy" },
];
const SERVICE_OPTIONS = [
  { v: "STANDARD" as ServiceType, label: "Standard", sub: "3–5 days", emoji: "📦" },
  { v: "EXPRESS"  as ServiceType, label: "Express",  sub: "1–2 days", emoji: "⚡" },
  { v: "OVERNIGHT"as ServiceType, label: "Overnight",sub: "Next day", emoji: "🚀" },
];
const PAYMENT_OPTIONS = [
  { m: "CASH_ON_DELIVERY" as PaymentMethod, label: "Cash on Delivery", icon: "💵" },
  { m: "ONLINE"           as PaymentMethod, label: "Online",           icon: "🌐" },
  { m: "CARD"             as PaymentMethod, label: "Card",             icon: "💳" },
];
const STEPS = [
  { id: 1, label: "Receiver",  icon: <Icon.User /> },
  { id: 2, label: "Package",   icon: <Icon.Package /> },
  { id: 3, label: "Logistics", icon: <Icon.Pin /> },
  { id: 4, label: "Payment",   icon: <Icon.Card /> },
];

// ─── Shared primitives ────────────────────────────────────────────────────────
const inp =
  "w-full h-9 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg " +
  "placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition";
const sel = `${inp} appearance-none cursor-pointer pr-8`;

const Label = ({ t, req }: { t: string; req?: boolean }) => (
  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
    {t}{req && <span className="text-orange-400 ml-0.5">*</span>}
  </p>
);
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);
const Sel = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
  <div className="relative">
    <select className={sel} value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon.ChevronDown /></div>
  </div>
);

// ─── Map Popup Modal ──────────────────────────────────────────────────────────
const MapModal = ({ lat, lng, title, onClose }: { lat: number; lng: number; title: string; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style={{ height: 480 }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
          <span className="text-orange-500"><Icon.Pin /></span>{title}
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"><Icon.X /></button>
      </div>
      <div className="flex-1 h-0">
        <CargoMap lat={lat} lng={lng} height="100%" onChange={() => {}} />
      </div>
      <div className="flex gap-4 px-5 py-3 border-t border-gray-100 flex-shrink-0 bg-gray-50">
        <span className="text-xs font-mono text-gray-500">Lat: <strong className="text-orange-600">{lat.toFixed(6)}</strong></span>
        <span className="text-xs font-mono text-gray-500">Lng: <strong className="text-orange-600">{lng.toFixed(6)}</strong></span>
      </div>
    </div>
  </div>
);

// ─── Shipment Detail Modal ────────────────────────────────────────────────────
const ShipmentDetailModal = ({ shipment, onClose, onViewMap }: { shipment: Shipment; onClose: () => void; onViewMap: () => void }) => {
  const st = STATUS_STYLE[shipment.status];
  const rows: [string, string][] = [
    ["Tracking ID", shipment.tracking_id],
    ["Sender ID",   shipment.sender_id],
    ["Receiver",    shipment.receiver_name],
    ["Email",       shipment.receiver_email],
    ["Phone",       shipment.receiver_phone],
    ["City",        shipment.receiver_city],
    ["Address",     shipment.receiver_address],
    ["Postal Code", shipment.receiver_postal_code],
    ["Package",     shipment.package_type],
    ["Weight",      `${shipment.weight_kg} kg`],
    ["Dimensions",  shipment.dimensions.length ? `${shipment.dimensions.length}×${shipment.dimensions.width}×${shipment.dimensions.height} cm` : "—"],
    ["Service",     shipment.service_type],
    ["Payment",     shipment.payment_method.replace(/_/g, " ")],
    ["Hub",         HUB_NAMES[shipment.current_hub_id] ?? shipment.current_hub_id],
    ["Total Price", `Rs. ${shipment.total_price.toLocaleString()}`],
    ["Created",     new Date(shipment.created_at).toLocaleString("en-LK")],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-0.5">Shipment Details</p>
            <p className="text-base font-bold text-gray-900 font-mono">{shipment.tracking_id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${st.bg} ${st.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
            </span>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"><Icon.X /></button>
          </div>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <div className="divide-y divide-gray-50">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-5 py-2.5">
                <span className="text-xs text-gray-400 font-medium w-32 shrink-0">{k}</span>
                <span className="text-xs text-gray-800 font-semibold text-right truncate max-w-[55%]">{v}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex justify-between items-center flex-shrink-0 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-100 transition">Close</button>
          {shipment.delivery_lat !== null && (
            <button onClick={onViewMap} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition shadow-sm shadow-orange-200">
              <Icon.MapIcon /> View on Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Shipments List Tab ───────────────────────────────────────────────────────
const ShipmentsTab = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filterDate,   setFilterDate]   = useState("");
  const [filterCity,   setFilterCity]   = useState("");
  const [filterSender, setFilterSender] = useState("");
  const [filterPhone,  setFilterPhone]  = useState("");
  const [selected,     setSelected]     = useState<Shipment | null>(null);
  const [mapShipment,  setMapShipment]  = useState<Shipment | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/shipments");
        if (!res.ok) throw new Error();
        const d = await res.json();
        setShipments(Array.isArray(d) ? d : (d.data ?? d.shipments ?? []));
      } catch {
        setShipments(MOCK_SHIPMENTS);
      } finally { setLoading(false); }
    })();
  }, []);

  const filtered = shipments.filter(s => {
    if (filterDate) {
      const created = new Date(s.created_at).toISOString().slice(0, 10);
      if (created !== filterDate) return false;
    }
    if (filterCity   && !s.receiver_city.toLowerCase().includes(filterCity.toLowerCase()))   return false;
    if (filterSender && !s.sender_id.toLowerCase().includes(filterSender.toLowerCase()))     return false;
    if (filterPhone  && !s.receiver_phone.includes(filterPhone))                             return false;
    return true;
  });

  const hasFilters = filterDate || filterCity || filterSender || filterPhone;
  const clearFilters = () => { setFilterDate(""); setFilterCity(""); setFilterSender(""); setFilterPhone(""); };

  return (
    <>
      {selected && !mapShipment && (
        <ShipmentDetailModal shipment={selected} onClose={() => setSelected(null)} onViewMap={() => setMapShipment(selected)} />
      )}
      {mapShipment && mapShipment.delivery_lat !== null && (
        <MapModal lat={mapShipment.delivery_lat!} lng={mapShipment.delivery_lng!} title={`${mapShipment.tracking_id} — ${mapShipment.receiver_city}`} onClose={() => setMapShipment(null)} />
      )}

      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-500"><Icon.Filter /></span>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Filters</p>
            {hasFilters && (
              <button onClick={clearFilters} className="ml-auto text-[11px] text-red-400 hover:text-red-500 font-semibold transition">Clear all</button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {/* Date */}
            <div>
              <Label t="Date" />
              <input type="date" className={inp} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            </div>
            {/* City */}
            <div>
              <Label t="City" />
              <div className="relative">
                <input className={inp + " pl-8"} placeholder="Colombo" value={filterCity} onChange={e => setFilterCity(e.target.value)} />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Search /></span>
              </div>
            </div>
            {/* Sender ID */}
            <div>
              <Label t="Sender ID" />
              <div className="relative">
                <input className={inp + " pl-8"} placeholder="69de53b1..." value={filterSender} onChange={e => setFilterSender(e.target.value)} />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon.User /></span>
              </div>
            </div>
            {/* Receiver Phone */}
            <div>
              <Label t="Receiver Phone" />
              <div className="relative">
                <input className={inp + " pl-8"} placeholder="077..." value={filterPhone} onChange={e => setFilterPhone(e.target.value)} />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Phone /></span>
              </div>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-gray-400 font-medium px-1">
          {loading ? "Loading…" : `${filtered.length} shipment${filtered.length !== 1 ? "s" : ""}${hasFilters ? " matched" : ""}`}
        </p>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2 text-sm">
            <Icon.Spin cls="w-5 h-5" /> Loading shipments…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm font-medium">No shipments found</p>
            {hasFilters && <p className="text-xs mt-1">Try clearing the filters</p>}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid gap-0 bg-gray-50 border-b border-gray-100 px-4 py-2.5"
              style={{ gridTemplateColumns: "1.4fr 1.2fr 0.9fr 1.1fr 0.9fr 0.9fr auto" }}>
              {["Tracking ID", "Receiver", "City", "Sender ID", "Phone", "Status", "Actions"].map(h => (
                <p key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</p>
              ))}
            </div>
            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {filtered.map(s => (
                <div key={s._id}
                  className="grid gap-0 px-4 py-3 items-center hover:bg-orange-50/30 transition"
                  style={{ gridTemplateColumns: "1.4fr 1.2fr 0.9fr 1.1fr 0.9fr 0.9fr auto" }}>
                  <div>
                    <p className="text-xs font-bold text-orange-600 font-mono">{s.tracking_id}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(s.created_at).toLocaleDateString("en-LK")}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 truncate">{s.receiver_name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{s.receiver_email}</p>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{s.receiver_city}</p>
                  <p className="text-[11px] text-gray-500 font-mono truncate" title={s.sender_id}>…{s.sender_id.slice(-8)}</p>
                  <p className="text-xs text-gray-600">{s.receiver_phone}</p>
                  <StatusBadge status={s.status} />
                  <div className="flex items-center gap-1.5 pl-2">
                    <button onClick={() => setSelected(s)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-orange-300 hover:text-orange-500 transition">
                      <Icon.Eye /> View
                    </button>
                    {s.delivery_lat !== null && (
                      <button onClick={() => setMapShipment(s)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-500 transition">
                        <Icon.MapIcon /> Map
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ─── Right Panel ─────────────────────────────────────────────────────────────
const RightPanel = ({ form, onMapClick, onGPS, mapKey }: {
  form: ShipmentForm; onMapClick: (lat: number, lng: number) => void; onGPS: () => void; mapKey?: string;
}) => {
  const pr = calcPrice(form);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 h-0 relative">
        <CargoMap key={mapKey} lat={form.delivery_lat ?? undefined} lng={form.delivery_lng ?? undefined} height="100%" onChange={(lat, lng) => onMapClick(lat, lng)} />
        <button type="button" onClick={onGPS} className="absolute top-3 right-3 z-10 flex items-center gap-1 text-[11px] font-semibold text-orange-500 border border-orange-200 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg hover:bg-orange-50 transition shadow-sm">
          <Icon.Target /> My GPS
        </button>
        {form.delivery_lat !== null && (
          <div className="absolute bottom-3 left-3 right-3 z-10 flex gap-2">
            <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-orange-200 text-xs font-mono text-orange-700 shadow-sm">
              <span className="text-[9px] font-sans font-bold text-gray-400 uppercase">Lat</span>{form.delivery_lat.toFixed(6)}
            </div>
            <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-orange-200 text-xs font-mono text-orange-700 shadow-sm">
              <span className="text-[9px] font-sans font-bold text-gray-400 uppercase">Lng</span>{form.delivery_lng!.toFixed(6)}
            </div>
          </div>
        )}
      </div>
      <div className="bg-white border-t border-gray-100 p-4 shrink-0">
        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-3">Estimated Price</p>
        <div className="space-y-1.5">
          <div className="flex justify-between"><span className="text-xs text-gray-400">Base fee</span><span className="text-xs font-semibold text-gray-700">Rs. {pr.base}</span></div>
          <div className="flex justify-between"><span className="text-xs text-gray-400">Weight ({parseFloat(String(form.weight_kg)) || 0} kg × Rs. {PricingConfig.price_per_kg})</span><span className="text-xs font-semibold text-gray-700">Rs. {pr.perKg}</span></div>
          <div className="flex justify-between"><span className="text-xs text-gray-400">Distance ({pr.km} km × Rs. {PricingConfig.price_per_km})</span><span className="text-xs font-semibold text-gray-700">Rs. {pr.perKm}</span></div>
          {pr.multiplierApplied && <div className="flex justify-between"><span className="text-xs text-orange-400">Express ×{PricingConfig.express_multiplier}</span><span className="text-xs font-semibold text-orange-400">applied</span></div>}
          <div className="flex justify-between pt-2 mt-1 border-t border-gray-100">
            <span className="text-sm font-bold text-orange-700">Total</span>
            <span className="text-sm font-bold text-orange-500">Rs. {pr.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Step Bar ─────────────────────────────────────────────────────────────────
const StepBar = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center gap-0 mb-6">
    {STEPS.map((s, i) => (
      <div key={s.id} className="flex items-center">
        <div className="flex flex-col items-center">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${current === s.id ? "bg-orange-500 text-white shadow shadow-orange-200" : current > s.id ? "bg-orange-100 text-orange-500" : "bg-gray-100 text-gray-400"}`}>
            {current > s.id ? <Icon.Check /> : s.icon}
          </div>
          <span className={`text-[10px] mt-1 font-medium ${current === s.id ? "text-orange-500" : current > s.id ? "text-orange-300" : "text-gray-400"}`}>{s.label}</span>
        </div>
        {i < STEPS.length - 1 && <div className={`w-10 h-px mx-1 mb-4 ${current > s.id ? "bg-orange-300" : "bg-gray-200"}`} />}
      </div>
    ))}
  </div>
);

// ─── Geocode hook ─────────────────────────────────────────────────────────────
type GeoStatus = "idle" | "loading" | "done" | "error";
function useGeocode(query: string): { result: { lat: number; lng: number } | null; status: GeoStatus } {
  const [result, setResult] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!query || query.length < 5) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("loading");
    timerRef.current = setTimeout(async () => {
      try {
        const encoded = encodeURIComponent(query + ", Sri Lanka");
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&countrycodes=lk`, { headers: { "Accept-Language": "en" } });
        const data = await res.json();
        if (data[0]) { setResult({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }); setStatus("done"); }
        else setStatus("error");
      } catch { setStatus("error"); }
    }, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);
  return { result, status };
}

// ─── Hub Selector ─────────────────────────────────────────────────────────────
const HubSelector = ({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) => {
  const [hubs, setHubs]       = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [warn, setWarn]       = useState("");
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/hubs");
        if (!res.ok) throw new Error();
        const d = await res.json();
        setHubs(Array.isArray(d) ? d : (d.data ?? d.hubs ?? []));
      } catch {
        setHubs([
          { _id: "69de3845f456dec19be397dd", name: "Colombo Central Hub", city: "Colombo" },
          { _id: "69de3845f456dec19be397de", name: "Kandy Regional Hub",  city: "Kandy" },
          { _id: "69de3845f456dec19be397df", name: "Galle Southern Hub",  city: "Galle" },
          { _id: "69de3845f456dec19be397e0", name: "Jaffna Northern Hub", city: "Jaffna" },
          { _id: "69de3845f456dec19be397e1", name: "Kurunegala Hub",      city: "Kurunegala" },
        ]);
        setWarn("Mock data — connect /api/hubs");
      } finally { setLoading(false); }
    })();
  }, []);
  if (loading) return <div className="flex items-center gap-2 py-3 text-sm text-gray-400"><Icon.Spin /> Loading hubs…</div>;
  return (
    <div>
      {warn && <p className="text-[11px] text-amber-500 mb-2">⚠ {warn}</p>}
      <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto">
        {hubs.map(h => (
          <button key={h._id} type="button" onClick={() => onSelect(h._id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all ${selectedId === h._id ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-200"}`}>
            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${selectedId === h._id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}><Icon.Building /></div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${selectedId === h._id ? "text-orange-700" : "text-gray-700"}`}>{h.name}</p>
              <p className={`text-[11px] ${selectedId === h._id ? "text-orange-400" : "text-gray-400"}`}>{h.city}</p>
            </div>
            {selectedId === h._id && <div className="text-orange-500 flex-shrink-0"><Icon.Check /></div>}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Form Steps ───────────────────────────────────────────────────────────────
const Step1 = ({ f, set }: { f: ShipmentForm; set: (k: keyof ShipmentForm, v: any) => void }) => (
  <div className="space-y-3">
    <Row>
      <div><Label t="Full Name" req /><input className={inp} placeholder="Nimna Perera" value={f.receiver_name} onChange={e => set("receiver_name", e.target.value)} /></div>
      <div><Label t="Email" req /><input type="email" className={inp} placeholder="nimna@example.com" value={f.receiver_email} onChange={e => set("receiver_email", e.target.value)} /></div>
    </Row>
    <Row>
      <div><Label t="Phone" req /><input type="tel" className={inp} placeholder="077XXXXXXX" value={f.receiver_phone} onChange={e => set("receiver_phone", e.target.value)} /></div>
      <div><Label t="Postal Code" req /><input className={inp} placeholder="20000" value={f.receiver_postal_code} onChange={e => set("receiver_postal_code", e.target.value)} /></div>
    </Row>
    <Row>
      <div><Label t="City" req /><input className={inp} placeholder="Kandy" value={f.receiver_city} onChange={e => set("receiver_city", e.target.value)} /></div>
      <div><Label t="Address" req /><input className={inp} placeholder="No 25, Peradeniya Road" value={f.receiver_address} onChange={e => set("receiver_address", e.target.value)} /></div>
    </Row>
  </div>
);

const Step2 = ({ f, set }: { f: ShipmentForm; set: (k: keyof ShipmentForm, v: any) => void }) => (
  <div className="space-y-3">
    <Row>
      <div><Label t="Package Type" req /><Sel value={f.package_type} onChange={v => set("package_type", v as PackageType)} options={PKG_OPTIONS} /></div>
      <div><Label t="Weight (kg)" req /><input type="number" step="0.1" min="0.1" className={inp} placeholder="5.0" value={f.weight_kg} onChange={e => set("weight_kg", e.target.value === "" ? "" : parseFloat(e.target.value))} /></div>
    </Row>
    <div>
      <Label t="Dimensions (cm) — optional" />
      <div className="grid grid-cols-3 gap-2">
        {(["length", "width", "height"] as const).map(d => (
          <div key={d}>
            <p className="text-[10px] text-gray-400 mb-1 capitalize">{d}</p>
            <input type="number" min="0" className={inp} placeholder="cm" value={f.dimensions[d] === 0 ? "" : f.dimensions[d]} onChange={e => set("dimensions", { ...f.dimensions, [d]: e.target.value === "" ? 0 : parseFloat(e.target.value) })} />
          </div>
        ))}
      </div>
    </div>
    <div>
      <Label t="Service Type" req />
      <div className="grid grid-cols-3 gap-2 mt-1">
        {SERVICE_OPTIONS.map(o => (
          <button key={o.v} type="button" onClick={() => set("service_type", o.v)}
            className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 text-center transition-all ${f.service_type === o.v ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-200"}`}>
            <span className="text-lg mb-1">{o.emoji}</span>
            <p className={`text-xs font-semibold ${f.service_type === o.v ? "text-orange-600" : "text-gray-700"}`}>{o.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{o.sub}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const Step3 = ({ f, set }: { f: ShipmentForm; set: (k: keyof ShipmentForm, v: any) => void }) => {
  const addressQuery = [f.receiver_address, f.receiver_city, f.receiver_postal_code].filter(Boolean).join(", ");
  const { result: geoResult, status: geoStatus } = useGeocode(addressQuery);
  const prevGeoRef = useRef<string>("");
  useEffect(() => {
    if (!geoResult) return;
    const key = `${geoResult.lat},${geoResult.lng}`;
    if (key === prevGeoRef.current) return;
    prevGeoRef.current = key;
    set("delivery_lat", parseFloat(geoResult.lat.toFixed(6)));
    set("delivery_lng", parseFloat(geoResult.lng.toFixed(6)));
  }, [geoResult, set]);
  const geoStatusColor: Record<string, string> = { loading: "text-amber-500", done: "text-green-500", error: "text-red-400" };
  const geoStatusLabel: Record<string, string> = { loading: "Locating address…", done: "✓ Address located", error: "Address not found" };
  return (
    <div className="space-y-4">
      <div><Label t="Pickup Hub" req /><HubSelector selectedId={f.current_hub_id} onSelect={id => set("current_hub_id", id)} /></div>
      {geoStatus !== "idle" && <p className={`text-[11px] font-medium ${geoStatusColor[geoStatus] ?? ""}`}>{geoStatusLabel[geoStatus]}</p>}
      <p className="text-xs text-gray-400">Pin the delivery location using the map on the right →</p>
    </div>
  );
};

const Step4 = ({ f, set }: { f: ShipmentForm; set: (k: keyof ShipmentForm, v: any) => void }) => (
  <div className="space-y-4">
    <div>
      <Label t="Payment Method" req />
      <div className="grid grid-cols-3 gap-2 mt-1">
        {PAYMENT_OPTIONS.map(pm => (
          <button key={pm.m} type="button" onClick={() => set("payment_method", pm.m)}
            className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 text-center transition-all ${f.payment_method === pm.m ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-200"}`}>
            <span className="text-xl mb-1">{pm.icon}</span>
            <p className={`text-xs font-semibold leading-tight ${f.payment_method === pm.m ? "text-orange-600" : "text-gray-600"}`}>{pm.label}</p>
          </button>
        ))}
      </div>
    </div>
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-orange-500 px-4 py-2.5"><p className="text-xs font-bold text-white uppercase tracking-wider">Order Summary</p></div>
      <div className="divide-y divide-gray-100">
        {[
          ["Receiver", f.receiver_name || "—"], ["Email", f.receiver_email || "—"], ["Phone", f.receiver_phone || "—"],
          ["City", f.receiver_city || "—"], ["Address", f.receiver_address || "—"], ["Package", f.package_type],
          ["Weight", f.weight_kg !== "" ? `${f.weight_kg} kg` : "—"],
          ["Dimensions", f.dimensions.length ? `${f.dimensions.length}×${f.dimensions.width}×${f.dimensions.height} cm` : "Not set"],
          ["Service", f.service_type], ["Payment", f.payment_method.replace(/_/g, " ")],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-gray-400 font-medium">{k}</span>
            <span className="text-xs text-gray-800 font-semibold text-right max-w-[60%] truncate">{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Success = ({ id, onReset }: { id: string; onReset: () => void }) => (
  <div className="flex flex-col items-center py-10 text-center">
    <div className="text-orange-500 mb-3 animate-bounce"><Icon.CheckCircle /></div>
    <h2 className="text-xl font-bold text-gray-800 mb-1">Shipment Created!</h2>
    <p className="text-sm text-gray-400 mb-5">Your package has been registered successfully.</p>
    <div className="border border-orange-200 bg-orange-50 rounded-2xl px-8 py-4 mb-6">
      <p className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-1">Tracking ID</p>
      <p className="text-lg font-bold text-orange-700 font-mono tracking-widest">{id}</p>
    </div>
    <button onClick={onReset} className="px-7 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition shadow shadow-orange-200">
      New Shipment
    </button>
  </div>
);

// ─── New Shipment Tab ─────────────────────────────────────────────────────────
const NewShipmentTab = () => {
  const [step, setStep]           = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [errors, setErrors]         = useState<string[]>([]);

  const [form, setForm] = useState<ShipmentForm>({
    sender_id: "69de53b1d7389b388eb26a10",
    receiver_name: "", receiver_email: "", receiver_phone: "",
    receiver_address: "", receiver_city: "", receiver_postal_code: "",
    package_type: "PARCEL", weight_kg: "",
    dimensions: { length: 0, width: 0, height: 0 },
    service_type: "STANDARD", payment_method: "CASH_ON_DELIVERY",
    current_hub_id: "", delivery_lat: null, delivery_lng: null,
  });

  const set = useCallback((key: keyof ShipmentForm, val: any) => {
    setForm(p => ({ ...p, [key]: val })); setErrors([]);
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setForm(p => ({ ...p, delivery_lat: parseFloat(lat.toFixed(6)), delivery_lng: parseFloat(lng.toFixed(6)) })); setErrors([]);
  }, []);

  const handleGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      setForm(p => ({ ...p, delivery_lat: parseFloat(pos.coords.latitude.toFixed(6)), delivery_lng: parseFloat(pos.coords.longitude.toFixed(6)) }));
    });
  }, []);

  const validate = () => {
    const e: string[] = [];
    if (step === 1) {
      if (!form.receiver_name.trim()) e.push("Full name required");
      if (!form.receiver_email.trim()) e.push("Email required");
      if (!form.receiver_phone.trim()) e.push("Phone required");
      if (!form.receiver_address.trim()) e.push("Address required");
      if (!form.receiver_city.trim()) e.push("City required");
      if (!form.receiver_postal_code.trim()) e.push("Postal code required");
    }
    if (step === 2) { if (form.weight_kg === "" || Number(form.weight_kg) <= 0) e.push("Valid weight required"); }
    if (step === 3) {
      if (!form.current_hub_id) e.push("Select a hub");
      if (form.delivery_lat === null) e.push("Pin delivery location on map");
    }
    setErrors(e);
    return e.length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // const res = await fetch("/api/shipments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      // const data = await res.json(); setTrackingId(data.tracking_id);
      await new Promise(r => setTimeout(r, 1200));
      setTrackingId(`SC-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="grid grid-cols-2 gap-0 border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      style={{ height: "calc(100vh - 370px)", minHeight: 560 }}>
      {/* LEFT */}
      <div className="bg-white p-6 border-r border-gray-100 flex flex-col h-full">
        {submitted ? (
          <Success id={trackingId} onReset={() => { setSubmitted(false); setStep(1); }} />
        ) : (
          <>
            <StepBar current={step} />
            {errors.length > 0 && (
              <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                {errors.map(e => <p key={e} className="text-xs text-red-500 font-medium">• {e}</p>)}
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              {step === 1 && <Step1 f={form} set={set} />}
              {step === 2 && <Step2 f={form} set={set} />}
              {step === 3 && <Step3 f={form} set={set} />}
              {step === 4 && <Step4 f={form} set={set} />}
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setStep(s => Math.max(s - 1, 1))} className={`px-5 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition ${step === 1 ? "invisible" : ""}`}>
                ← Back
              </button>
              <button onClick={() => step < 4 ? (validate() && setStep(step + 1)) : submit()} disabled={submitting}
                className="px-6 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg shadow-sm shadow-orange-200 flex items-center gap-2 hover:bg-orange-600 transition disabled:opacity-60">
                {submitting ? <Icon.Spin /> : step === 4 ? "Submit Shipment" : "Continue →"}
              </button>
            </div>
          </>
        )}
      </div>
      {/* RIGHT: Map */}
      <div className="bg-gray-50 flex flex-col h-full">
        <RightPanel form={form} onMapClick={handleMapClick} onGPS={handleGPS} mapKey={`${form.delivery_lat},${form.delivery_lng}`} />
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShipmentPage() {
  const [activeTab, setActiveTab] = useState<"new" | "list">("new");

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp    { from { opacity:0; transform:translateY(14px);  } to { opacity:1; transform:translateY(0); } }
      `}</style>



      {/* Hero */}
      <div className="max-w-screen-xl mx-auto px-6 pt-8 pb-4" style={{ animation: "fadeUp 0.5s ease both" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-full px-3 py-1 text-[11px] font-semibold text-orange-500 mb-3">
              📦 Shipment Management
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SmartCargo Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Create and manage your shipments from one place.</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button type="button" onClick={() => setActiveTab("list")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:text-orange-500 transition shadow-sm">
              <Icon.Search /> Track Shipment
            </button>
            <button type="button" onClick={() => setActiveTab("list")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:text-orange-500 transition shadow-sm">
              <Icon.History /> History
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Total Shipments", value: "1,284", icon: "📦", color: "text-gray-700",    bg: "bg-gray-50",   border: "border-gray-100"   },
            { label: "Active",          value: "38",    icon: "⚡", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
            { label: "Delivered",       value: "1,246", icon: "✅", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100"  },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.bg} ${s.border}`}>
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className={`text-lg font-bold leading-none ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-screen-xl mx-auto px-6" style={{ animation: "fadeUp 0.55s ease both" }}>
        <div className="flex items-center gap-1 border-b border-gray-100">
          {([
            { key: "new",  label: "New Shipment",  icon: "➕" },
            { key: "list", label: "All Shipments", icon: "📋" },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
                activeTab === t.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <main className="max-w-screen-xl mx-auto px-6 pb-8 pt-5" style={{ animation: "fadeUp 0.6s ease both" }}>
        {activeTab === "new"  && <NewShipmentTab />}
        {activeTab === "list" && <ShipmentsTab />}
      </main>
    </div>
  );
}