import type { AvailableShipment, Consignment } from "../types/consignment";
import type { Hub } from "../types/Hubs";
import type { UserRoleType } from "../types/User";



export const MOCK_HUBS: Hub[] = [
  {
    _id: "69d7cdf69705111aa65ebc69",
    hub_name: "Colombo Central Hub",
    city: "Colombo 01",
    address: "No. 1, Main Street, Colombo 01",
    contact_no: "0112345601",
    latitude: 6.9271,
    longitude: 79.8612,
  },
  {
    _id: "69d7cdf69705111aa65ebc70",
    hub_name: "Kandy Distribution Hub",
    city: "Kandy",
    address: "No. 2, Peradeniya Road, Kandy",
    contact_no: "0812345602",
    latitude: 7.2906,
    longitude: 80.6337,
  },
  {
    _id: "69d7cdf69705111aa65ebc71",
    hub_name: "Galle Southern Hub",
    city: "Galle",
    address: "No. 3, Matara Road, Galle",
    contact_no: "0912345603",
    latitude: 6.0535,
    longitude: 80.2210,
  },
  {
    _id: "69d7cdf69705111aa65ebc72",
    hub_name: "Negombo North Hub",
    city: "Negombo",
    address: "No. 4, Colombo Road, Negombo",
    contact_no: "0312345604",
    latitude: 7.2081,
    longitude: 79.8358,
  },
  {
    _id: "69d7cdf69705111aa65ebc73",
    hub_name: "Jaffna Hub",
    city: "Jaffna",
    address: "No. 5, Hospital Road, Jaffna",
    contact_no: "0212345605",
    latitude: 9.6615,
    longitude: 80.0255,
  },
];

export const EMPLOYEE_ROLES: UserRoleType[] = ["DISPATCHER", "DRIVER"];



//consigment data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>





// ─── Hub ID → Display Label Map ──────────────────────────
export const HUB_LABELS: Record<string, string> = {
  hub_negombo:  "Negombo",
  hub_colombo:  "Colombo",
  hub_kandy:    "Kandy",
  hub_galle:    "Galle",
  hub_matara:   "Matara",
  hub_matale:   "Matale",
  hub_kurunegala: "Kurunegala",
  hub_nuwara:   "Nuwara Eliya",
};

// ─── Mock Consignments (field names match backend schema) ─
export const consignments: Consignment[] = [
  {
    consignment_id:    "CON-1001",
    vehicle_id:        "WP-6543",
    vtype:             "Truck",
    origin_hub_id:     "hub_negombo",
    destination_hub_id:"hub_colombo",
    origin_label:      "Negombo",
    dest_label:        "Colombo",
    driver:            "Nimal Silva",
    shipment_ids:      ["TRK-00821", "TRK-00822", "TRK-00823", "TRK-00824", "TRK-00825"],
    shipment_count:    45,
    total_weight_kg:   3200,
    capacity_kg:       5000,
    departure_time:    "2026-05-09T08:00:00.000Z",
    estimated_arrival: "2026-05-09T11:30:00.000Z",
    status:            "DISPATCHED",
    parcels: [
      { id: "TRK-00821", city: "Colombo 03", wt: 12.5 },
      { id: "TRK-00822", city: "Colombo 07", wt: 8.0  },
      { id: "TRK-00823", city: "Maradana",   wt: 22.3 },
      { id: "TRK-00824", city: "Colombo 10", wt: 5.5  },
      { id: "TRK-00825", city: "Peliyagoda", wt: 18.0 },
    ],
  },
  {
    consignment_id:    "CON-1002",
    vehicle_id:        "CP-8821",
    vtype:             "Truck",
    origin_hub_id:     "hub_colombo",
    destination_hub_id:"hub_kandy",
    origin_label:      "Colombo",
    dest_label:        "Kandy",
    driver:            "Ruwan Fernando",
    shipment_ids:      ["TRK-00901", "TRK-00902", "TRK-00903"],
    shipment_count:    12,
    total_weight_kg:   720,
    capacity_kg:       2000,
    departure_time:    "2026-05-09T06:30:00.000Z",
    estimated_arrival: "2026-05-09T10:00:00.000Z",
    status:            "CREATED",
    parcels: [
      { id: "TRK-00901", city: "Kandy City",  wt: 30.0 },
      { id: "TRK-00902", city: "Peradeniya",  wt: 15.5 },
      { id: "TRK-00903", city: "Katugastota", wt: 44.2 },
    ],
  },
  {
    consignment_id:    "CON-1003",
    vehicle_id:        "NP-3341",
    vtype:             "Van",
    origin_hub_id:     "hub_kandy",
    destination_hub_id:"hub_matale",
    origin_label:      "Kandy",
    dest_label:        "Matale",
    driver:            "Asanka Dias",
    shipment_ids:      ["TRK-01001", "TRK-01002"],
    shipment_count:    8,
    total_weight_kg:   180,
    capacity_kg:       800,
    departure_time:    "2026-05-09T10:00:00.000Z",
    estimated_arrival: "2026-05-09T11:15:00.000Z",
    status:            "DISPATCHED",
    parcels: [
      { id: "TRK-01001", city: "Matale",   wt: 22.0 },
      { id: "TRK-01002", city: "Dambulla", wt: 35.0 },
    ],
  },
  {
    consignment_id:    "CON-1004",
    vehicle_id:        "SP-1129",
    vtype:             "Van",
    origin_hub_id:     "hub_galle",
    destination_hub_id:"hub_matara",
    origin_label:      "Galle",
    dest_label:        "Matara",
    driver:            "Pradeep Kumara",
    shipment_ids:      ["TRK-01101", "TRK-01102"],
    shipment_count:    20,
    total_weight_kg:   550,
    capacity_kg:       600,
    departure_time:    "2026-05-09T07:00:00.000Z",
    estimated_arrival: "2026-05-09T08:30:00.000Z",
    status:            "ARRIVED",
    parcels: [
      { id: "TRK-01101", city: "Matara",   wt: 80.0 },
      { id: "TRK-01102", city: "Weligama", wt: 45.0 },
    ],
  },
  {
    consignment_id:    "CON-1005",
    vehicle_id:        "WP-6543",
    vtype:             "Truck",
    origin_hub_id:     "hub_colombo",
    destination_hub_id:"hub_galle",
    origin_label:      "Colombo",
    dest_label:        "Galle",
    driver:            "Nimal Silva",
    shipment_ids:      ["TRK-01201", "TRK-01202"],
    shipment_count:    30,
    total_weight_kg:   1800,
    capacity_kg:       5000,
    departure_time:    "2026-05-09T13:00:00.000Z",
    estimated_arrival: "2026-05-09T16:30:00.000Z",
    status:            "CREATED",
    parcels: [
      { id: "TRK-01201", city: "Galle",     wt: 120.0 },
      { id: "TRK-01202", city: "Hikkaduwa", wt: 55.0  },
    ],
  },
  {
    consignment_id:    "CON-1006",
    vehicle_id:        "CP-8821",
    vtype:             "Truck",
    origin_hub_id:     "hub_negombo",
    destination_hub_id:"hub_kurunegala",
    origin_label:      "Negombo",
    dest_label:        "Kurunegala",
    driver:            "Ruwan Fernando",
    shipment_ids:      ["TRK-01301", "TRK-01302"],
    shipment_count:    18,
    total_weight_kg:   900,
    capacity_kg:       2000,
    departure_time:    "2026-05-09T09:00:00.000Z",
    estimated_arrival: "2026-05-09T11:00:00.000Z",
    status:            "DISPATCHED",
    parcels: [
      { id: "TRK-01301", city: "Kurunegala",  wt: 200.0 },
      { id: "TRK-01302", city: "Polgahawela", wt: 88.0  },
    ],
  },
  {
    consignment_id:    "CON-1007",
    vehicle_id:        "NP-3341",
    vtype:             "Van",
    origin_hub_id:     "hub_kandy",
    destination_hub_id:"hub_nuwara",
    origin_label:      "Kandy",
    dest_label:        "Nuwara Eliya",
    driver:            "Asanka Dias",
    shipment_ids:      ["TRK-01401", "TRK-01402"],
    shipment_count:    6,
    total_weight_kg:   95,
    capacity_kg:       800,
    departure_time:    "2026-05-09T12:00:00.000Z",
    estimated_arrival: "2026-05-09T14:00:00.000Z",
    status:            "CREATED",
    parcels: [
      { id: "TRK-01401", city: "Nuwara Eliya", wt: 45.0 },
      { id: "TRK-01402", city: "Hatton",       wt: 30.0 },
    ],
  },
];

// ─── Available Shipments for batching ────────────────────
export const availableShipments: AvailableShipment[] = [
  { id: "TRK-02001", dest: "Colombo 03",   wt: 14.5 },
  { id: "TRK-02002", dest: "Colombo 10",   wt: 8.0  },
  { id: "TRK-02003", dest: "Maradana",     wt: 22.3 },
  { id: "TRK-02004", dest: "Peliyagoda",   wt: 5.5  },
  { id: "TRK-02005", dest: "Wellampitiya", wt: 18.0 },
  { id: "TRK-02006", dest: "Colombo 07",   wt: 11.0 },
  { id: "TRK-02007", dest: "Rajagiriya",   wt: 9.2  },
  { id: "TRK-02008", dest: "Kotte",        wt: 33.0 },
];

// ─── Dashboard Stats ──────────────────────────────────────
export const stats = [
  { value: "7",   label: "Active Consignments",  delta: "+ 2 today",    up: true,  topColor: "border-t-orange-500" },
  { value: "142", label: "Delivered This Month",  delta: "+ 98%",        up: true,  topColor: "border-t-green-600"  },
  { value: "318", label: "Parcels In Transit",    delta: "Stable",       up: false, topColor: "border-t-blue-700"   },
  { value: "4",   label: "Pending Dispatch",      delta: "Needs action", up: false, topColor: "border-t-amber-600"  },
];

// ─── Status Config (backend enum values as keys) ──────────
// Backend enum: CREATED | DISPATCHED | ARRIVED | COMPLETED
export const statusCfg: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  CREATED:    { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  label: "Created"   },
  DISPATCHED: { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500", label: "Dispatched" },
  ARRIVED:    { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  label: "Arrived"   },
  COMPLETED:  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  label: "Completed" },
};

// ─── Tab Filters (using backend status values) ────────────
export const TABS = [
  { label: "Active",           count: 2,   statuses: ["DISPATCHED"] as string[] },
  { label: "Pending Dispatch", count: 3,   statuses: ["CREATED"] as string[]    },
  { label: "History",          count: 142, statuses: ["ARRIVED", "COMPLETED"] as string[] },
];

// ─── Tracking Timeline (mock — will come from backend event log) ──
export const trackingTimeline = [
  { status: "Dispatched",    loc: "Negombo Expressway Checkpoint", time: "Today 09:45 AM" },
  { status: "Created",       loc: "Negombo Sorting Center",        time: "Today 08:00 AM" },
  { status: "Batch Created", loc: "Negombo Sorting Center",        time: "Yesterday 11:30 PM" },
];

// ─── Shared CSS class strings ─────────────────────────────
export const inputCls  = "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-orange-400 focus:bg-white transition-colors";
export const selectCls = "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-orange-400 focus:bg-white transition-colors";

// ─── Helper: format ISO date string → "HH:MM" and "YYYY-MM-DD" ──
export function formatDateTime(iso: string): { time: string; date: string } {
  const d = new Date(iso);
  const time = d.toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = d.toISOString().split("T")[0];
  return { time, date };
}