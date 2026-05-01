import type { Shipment, PackageType, ServiceType, PaymentMethod } from "../../types/shipment";


// ─── Pricing Config ───────────────────────────────────────────────────────────
export const PricingConfig = {
  base_price: 250,
  price_per_kg: 60,
  price_per_km: 40,
  express_multiplier: 1.5,
};

// ─── Hub coordinates ──────────────────────────────────────────────────────────
export const HUB_COORDS: Record<string, { lat: number; lng: number }> = {
  "69de3845f456dec19be397dd": { lat: 6.9271, lng: 79.8612 },
  "69de3845f456dec19be397de": { lat: 7.2906, lng: 80.6337 },
  "69de3845f456dec19be397df": { lat: 6.0535, lng: 80.2210 },
  "69de3845f456dec19be397e0": { lat: 9.6615, lng: 80.0255 },
  "69de3845f456dec19be397e1": { lat: 7.4863, lng: 80.3647 },
};

export const HUB_NAMES: Record<string, string> = {
  "69de3845f456dec19be397dd": "Colombo Central Hub",
  "69de3845f456dec19be397de": "Kandy Regional Hub",
  "69de3845f456dec19be397df": "Galle Southern Hub",
  "69de3845f456dec19be397e0": "Jaffna Northern Hub",
  "69de3845f456dec19be397e1": "Kurunegala Hub",
};

// ─── Mock Shipments ───────────────────────────────────────────────────────────
export const MOCK_SHIPMENTS: Shipment[] = [

];

// ─── Select Options ───────────────────────────────────────────────────────────
export const PKG_OPTIONS: { value: PackageType; label: string }[] = [
  { value: "PARCEL", label: "Parcel" }, { value: "DOCUMENT", label: "Document" },
  { value: "FRAGILE", label: "Fragile" }, { value: "HEAVY", label: "Heavy" },
];

export const SERVICE_OPTIONS = [
  { v: "STANDARD" as ServiceType, label: "Standard", sub: "3–5 days", emoji: "📦" },
  { v: "EXPRESS"  as ServiceType, label: "Express",  sub: "1–2 days", emoji: "⚡" },
  { v: "OVERNIGHT"as ServiceType, label: "Overnight",sub: "Next day", emoji: "🚀" },
];

export const PAYMENT_OPTIONS = [
  { m: "CASH_ON_DELIVERY" as PaymentMethod, label: "Cash on Delivery", icon: "💵" },
  { m: "ONLINE"           as PaymentMethod, label: "Online",           icon: "🌐" },
  { m: "CARD"             as PaymentMethod, label: "Card",             icon: "💳" },
];

export const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:    { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-400",  label: "Pending" },
  IN_TRANSIT: { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-500",   label: "In Transit" },
  DELIVERED:  { bg: "bg-green-50",  text: "text-green-600",  dot: "bg-green-500",  label: "Delivered" },
  CANCELLED:  { bg: "bg-red-50",    text: "text-red-500",    dot: "bg-red-400",    label: "Cancelled" },
};

// ─── CSS class helpers ────────────────────────────────────────────────────────
export const inp =
  "w-full h-9 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg " +
  "placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition";
export const sel = `${inp} appearance-none cursor-pointer pr-8`;