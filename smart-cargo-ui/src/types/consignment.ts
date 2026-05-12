// Backend status enum: CREATED | DISPATCHED | ARRIVED | COMPLETED
export type Status =
  | "CREATED"
  | "DISPATCHED"
  | "ARRIVED"
  | "COMPLETED";

export interface Parcel {
  id: string;       // tracking ID (e.g. TRK-00821)
  city: string;     // delivery city / area
  wt: number;       // weight in kg
}

// Maps 1-to-1 with the Consignment Mongoose document
export interface Consignment {
  // _id / consignment_id from backend
  consignment_id: string;          // e.g. "CON-1713158400"

  // vehicle_id as plain string (backend stores as string)
  vehicle_id: string;              // e.g. "WP-6543"
  vtype: "Truck" | "Van" | "Bike"; // UI-only, derived from vehicle lookup

  // Hub ObjectIds stored as strings on the frontend
  origin_hub_id: string;           // e.g. "hub_negombo"
  destination_hub_id: string;      // e.g. "hub_colombo"

  // Display labels resolved from hub IDs (UI-only)
  origin_label: string;            // e.g. "Negombo"
  dest_label: string;              // e.g. "Colombo"

  driver: string;                  // driver name (resolved from vehicle/driver lookup)

  shipment_ids: string[];          // tracking IDs array — maps to backend shipment_ids
  shipment_count: number;          // shipment_ids.length, used in table UI

  total_weight_kg: number;         // maps to backend total_weight_kg
  capacity_kg: number;             // vehicle max capacity, UI-only

  departure_time: string;          // ISO date string — maps to backend departure_time
  estimated_arrival: string;       // ISO date string — maps to backend estimated_arrival

  status: Status;                  // maps to backend status enum

  // Parcel detail objects — resolved on frontend from shipment_ids
  parcels: Parcel[];
}

// DTO shape sent to POST /consignments
export interface CreateConsignmentDto {
  consignment_id: string;
  vehicle_id: string;
  total_weight_kg: number;
  origin_hub_id: string;
  destination_hub_id: string;
  shipment_ids: string[];
  departure_time: string;   // ISO 8601
  estimated_arrival: string; // ISO 8601
}

export interface AvailableShipment {
  id: string;    // tracking ID
  dest: string;  // destination area label
  wt: number;    // weight kg
}