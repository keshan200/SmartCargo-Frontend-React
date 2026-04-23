// ─── Types ────────────────────────────────────────────────────────────────────
export type PackageType   = "PARCEL" | "DOCUMENT" | "FRAGILE" | "HEAVY";
export type ServiceType   = "STANDARD" | "EXPRESS" | "OVERNIGHT";
export type PaymentMethod = "CASH_ON_DELIVERY" | "ONLINE" | "CARD";
export type ShipmentStatus = "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface PackageDimensions { length: number; width: number; height: number }
export interface Hub { _id: string; name: string; city: string; address?: string; lat?: number; lng?: number }

export interface ShipmentForm {
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