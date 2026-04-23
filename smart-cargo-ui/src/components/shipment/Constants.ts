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