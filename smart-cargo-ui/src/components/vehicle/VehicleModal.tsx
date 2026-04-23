import { useCallback, useEffect, useState, type JSX } from "react";
import toast from "react-hot-toast";
import CargoMap from "../Map";
import type {
  CreateVehicleDto,
  Vehicle,
  VehicleStatus,
  VehicleType,
} from "../../types/Vehicle";
import type { Hub } from "../../types/Hubs";
import { getAllHubs } from "../../services/hub.service";

// ─── helpers ────────────────────────────────────────────────────────────────

const inputCls = (hasError?: boolean) =>
  `w-full px-3.5 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 placeholder-gray-300 ${
    hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;

const STATUS_COLORS: Record<VehicleStatus, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  ON_TRIP: "bg-blue-100 text-blue-700",
  MAINTENANCE: "bg-amber-100 text-amber-700",
  OUT_OF_SERVICE: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Out of Service",
};

const TYPE_ICONS: Record<VehicleType, JSX.Element> = {
  BIKE: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="5.5" cy="17.5" r="3.5" strokeWidth={2} />
      <circle cx="18.5" cy="17.5" r="3.5" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.5 17.5L10 10l3 4 2-5h3M15 6h2"
      />
    </svg>
  ),
  VAN: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="1" y="7" width="18" height="11" rx="2" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 12l3 1v5h-3M1 15h18"
      />
      <circle cx="5.5" cy="18" r="1.5" strokeWidth={2} />
      <circle cx="14.5" cy="18" r="1.5" strokeWidth={2} />
    </svg>
  ),
  TRUCK: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M1 3h14v13H1zM15 8h5l3 3v5h-8V8z"
      />
      <circle cx="5.5" cy="18.5" r="1.5" strokeWidth={2} />
      <circle cx="17.5" cy="18.5" r="1.5" strokeWidth={2} />
    </svg>
  ),
};

// ─── types ───────────────────────────────────────────────────────────────────

export type ModalMode = "add" | "edit" | "view" | null;

type VehicleErrors = Partial<Record<keyof CreateVehicleDto | "status", string>>;

// Extend the hub type to include optional lat/lng coordinates

interface VehicleModalProps {
  modalMode: ModalMode;
  selectedVehicle: Vehicle;
  setSelectedVehicle: React.Dispatch<React.SetStateAction<Vehicle>>;
  closeModal: () => void;
  mapStep: boolean;
  setMapStep: (step: boolean) => void;
  errors: VehicleErrors;
  validateStep1: () => boolean;
  handleSave: () => void;
  openModal: (mode: ModalMode, vehicle?: Vehicle) => void;
  hubs?: Hub[];
}

export const VehicleModal = ({
  modalMode,
  selectedVehicle,
  setSelectedVehicle,
  closeModal,
  mapStep,
  setMapStep,
  errors,
  validateStep1,
  handleSave,
  openModal,
  hubs = [],
}: VehicleModalProps) => {


  const [allhub, setHubs] = useState<Hub[]>([]);



  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const data = await getAllHubs();
        console.log(data)
        setHubs(data);
      } catch (error) {
        console.error("Failed to fetch hubs:", error);
      }
    };
    fetchHubs();
  }, []);

  const isWide = mapStep || modalMode === "view";

  const setField = <K extends keyof Vehicle>(key: K, val: Vehicle[K]) =>
    setSelectedVehicle((v) => ({ ...v, [key]: val }));

  const VEHICLE_TYPES: VehicleType[] = ["BIKE", "VAN", "TRUCK"];
  const VEHICLE_STATUSES: VehicleStatus[] = [
    "AVAILABLE",
    "ON_TRIP",
    "MAINTENANCE",
    "OUT_OF_SERVICE",
  ];




  const handleHubJump = (hubId: string) => {
    const hub = hubs.find((h) => h._id === hubId);
    if (!hub) return;

    if (hub.latitude != null && hub.longitude != null) {
      setSelectedVehicle((v) => ({
        ...v,
        current_lat: hub.latitude!,
        current_lng: hub.longitude!,
      }));
    }
  };




  const handleMapChange = useCallback((lat: number, lng: number) => {
    setSelectedVehicle((v) => ({ ...v, current_lat: lat, current_lng: lng }));
  }, []);



  if (!modalMode) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div
        className={`bg-white rounded-2xl w-full border border-gray-200 shadow-2xl overflow-hidden transition-all ${
          isWide ? "max-w-4xl" : "max-w-lg"
        }`}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 3h14v13H1zM15 8h5l3 3v5h-8V8z"
                />
                <circle cx="5.5" cy="18.5" r="1.5" strokeWidth={2} />
                <circle cx="17.5" cy="18.5" r="1.5" strokeWidth={2} />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {modalMode === "add"
                  ? "New Vehicle"
                  : modalMode === "edit"
                    ? "Edit Vehicle"
                    : "Vehicle Details"}
              </p>
              {modalMode !== "view" && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {mapStep
                    ? "Step 2 — Pin current location on map"
                    : "Step 1 — Vehicle information"}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* VIEW MODE                                                        */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {modalMode === "view" && (
          <>
            <div className="flex min-h-[460px]">
              {/* sidebar */}
              <div className="w-64 shrink-0 p-6 border-r border-gray-100 bg-gray-50 flex flex-col gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-orange-500">
                      {TYPE_ICONS[selectedVehicle.vehicle_type]}
                    </span>
                    <span className="text-xs font-medium text-orange-500 uppercase tracking-wide">
                      {selectedVehicle.vehicle_type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-mono leading-snug">
                    {selectedVehicle.vehicle_number}
                  </h3>
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      STATUS_COLORS[selectedVehicle.status]
                    }`}
                  >
                    {STATUS_LABELS[selectedVehicle.status]}
                  </span>
                </div>

                {[
                  {
                    label: "Capacity",
                    val: `${selectedVehicle.capacity_kg} kg`,
                  },
                  {
                    label: "Assigned Hub",
                    val: selectedVehicle.assigned_hub_id
                      ? (hubs.find(
                          (h) => h._id === selectedVehicle.assigned_hub_id,
                        )?.hub_name ?? selectedVehicle.assigned_hub_id)
                      : "—",
                  },
                  {
                    label: "Driver",
                    val: selectedVehicle.current_driver_id ?? "Unassigned",
                  },
                ].map((r) => (
                  <div key={r.label}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {r.label}
                    </p>
                    <p className="text-sm text-gray-700">{r.val}</p>
                  </div>
                ))}

                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">
                    GPS
                  </p>
                  <p className="text-sm text-gray-900 font-mono">
                    {(selectedVehicle.current_lat ?? 0).toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-900 font-mono mt-1">
                    {(selectedVehicle.current_lng ?? 0).toFixed(6)}
                  </p>
                </div>
              </div>

              {/* map */}
              <div className="flex-1 p-4">
                <CargoMap
                  lat={selectedVehicle.current_lat ?? 0}
                  lng={selectedVehicle.current_lng ?? 0}
                  readOnly
                  height="100%"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => openModal("edit", selectedVehicle)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                Edit Vehicle
              </button>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ADD / EDIT — Step 1                                             */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {(modalMode === "add" || modalMode === "edit") && !mapStep && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Vehicle Number */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Vehicle Number *
                </label>
                <input
                  value={selectedVehicle.vehicle_number}
                  onChange={(e) => setField("vehicle_number", e.target.value)}
                  placeholder="e.g. WP CAB-1234"
                  className={inputCls(!!errors.vehicle_number) + " font-mono"}
                />
                {errors.vehicle_number && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.vehicle_number}
                  </p>
                )}
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Vehicle Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {VEHICLE_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setField("vehicle_type", t)}
                      className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedVehicle.vehicle_type === t
                          ? "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={
                          selectedVehicle.vehicle_type === t
                            ? "text-orange-500"
                            : "text-gray-400"
                        }
                      >
                        {TYPE_ICONS[t]}
                      </span>
                      {t}
                    </button>
                  ))}
                </div>
                {errors.vehicle_type && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.vehicle_type}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Capacity (kg) *
                </label>
                <input
                  type="number"
                  min={0}
                  value={selectedVehicle.capacity_kg || ""}
                  onChange={(e) =>
                    setField("capacity_kg", parseFloat(e.target.value) || 0)
                  }
                  placeholder="e.g. 500"
                  className={inputCls(!!errors.capacity_kg) + " font-mono"}
                />
                {errors.capacity_kg && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.capacity_kg}
                  </p>
                )}
              </div>

              {/* Status — only in edit mode */}
              {modalMode === "edit" && (
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {VEHICLE_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setField("status", s)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          selectedVehicle.status === s
                            ? STATUS_COLORS[s] +
                              " border-transparent ring-2 ring-offset-1 ring-orange-400"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Hub */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Assigned Hub
                </label>
                <select
                  value={selectedVehicle.assigned_hub_id ?? ""}
                  onChange={(e) =>
                    setField("assigned_hub_id", e.target.value || undefined)
                  }
                  className={inputCls()}
                >
                  <option value="">No hub assigned</option>
                  {allhub.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.hub_name} — {h.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => validateStep1() && setMapStep(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all hover:-translate-y-0.5"
              >
                Next — Pin Location
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ADD / EDIT — Step 2 (map)                                       */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {(modalMode === "add" || modalMode === "edit") && mapStep && (
          <div className="flex min-h-[460px]">
            {/* sidebar */}
            <div className="w-56 shrink-0 p-5 border-r border-gray-100 bg-gray-50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-3.5">
                  <p className="text-sm font-semibold text-gray-700">
                    Click on the map to pin
                  </p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Or select a hub / enter coordinates manually below.
                  </p>
                </div>

               

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Latitude
                  </label>
                  <input
                    contentEditable={false}
                    type="number"
                    step="0.0001"
                    value={selectedVehicle.current_lat ?? ""}
                    onChange={(e) =>
                      setField("current_lat", parseFloat(e.target.value) || 0)
                    }
                    placeholder="6.9271"
                    className={inputCls() + " font-mono"}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Longitude
                  </label>
                  <input
                    contentEditable={false}
                    type="number"
                    step="0.0001"
                    value={selectedVehicle.current_lng ?? ""}
                    onChange={(e) =>
                      setField("current_lng", parseFloat(e.target.value) || 0)
                    }
                    placeholder="79.8612"
                    className={inputCls() + " font-mono"}
                  />
                </div>
                {errors.current_lat && (
                  <p className="text-red-400 text-xs">{errors.current_lat}</p>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSave}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                >
                  {modalMode === "add" ? "Create Vehicle" : "Save Changes"}
                </button>
                <button
                  onClick={() => setMapStep(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-white transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>

            {/* map */}
            <div className="flex-1 p-4">
              <CargoMap
                lat={selectedVehicle.current_lat ?? 0}
                lng={selectedVehicle.current_lng ?? 0}
                height="100%"
                onChange={handleMapChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
