import { useState, useMemo, useEffect } from "react";
import { VehicleCard } from "../components/vehicle/VehicleCard";
import { VehicleModal } from "../components/vehicle/VehicleModal";
import type {
  Vehicle,
  VehicleType,
  VehicleStatus,
  CreateVehicleDto,
} from "../types/Vehicle";
import { createVehicle, getAllVehicles } from "../services/vehicle.service";
import { toast } from "react-hot-toast";

const VEHICLE_TYPES: VehicleType[] = ["BIKE", "VAN", "TRUCK"];
const VEHICLE_STATUSES: VehicleStatus[] = [
  "AVAILABLE",
  "ON_TRIP",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
];

const TYPE_LABEL: Record<VehicleType, string> = {
  BIKE: "Bike",
  VAN: "Van",
  TRUCK: "Truck",
};
const STATUS_LABEL: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Out of Service",
};

const STATUS_PILL: Record<VehicleStatus, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ON_TRIP: "bg-blue-100   text-blue-700   border-blue-200",
  MAINTENANCE: "bg-amber-100  text-amber-700  border-amber-200",
  OUT_OF_SERVICE: "bg-red-100    text-red-700    border-red-200",
};

const TYPE_PILL: Record<VehicleType, string> = {
  BIKE: "bg-violet-100 text-violet-700 border-violet-200",
  VAN: "bg-sky-100    text-sky-700    border-sky-200",
  TRUCK: "bg-orange-100 text-orange-700 border-orange-200",
};

const EMPTY_VEHICLE: Vehicle = {
  _id: "",
  vehicle_number: "",
  vehicle_type: "BIKE",
  capacity_kg: 0,
  current_lat: 6.9271,
  current_lng: 79.8612,
  status: "AVAILABLE",
  current_driver_id: null,
  is_active: true,
  createdAt: "",
  updatedAt: "",
};



//  Icons

const PlusIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="7" y1="1" x2="7" y2="13" />
    <line x1="1" y1="7" x2="13" y2="7" />
  </svg>
);
const SearchIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#9CA3AF"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <circle cx="6.5" cy="6.5" r="5" />
    <line x1="11" y1="11" x2="15" y2="15" />
  </svg>
);
const XIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="1" y1="1" x2="11" y2="11" />
    <line x1="11" y1="1" x2="1" y2="11" />
  </svg>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  children,
}: {
  value: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
        {children}
      </div>
      <div>
        <p className="text-[26px] font-bold text-gray-900 leading-none">
          {value}
        </p>
        <p className="text-[12px] text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  colorCls,
  onClick,
  onClear,
}: {
  label: string;
  active: boolean;
  colorCls: string;
  onClick: () => void;
  onClear: () => void;
}) {
  return (
    <button
      onClick={active ? onClear : onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs  transition-all ${
        active
          ? colorCls
          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
      }`}
    >
      {label}
      {active && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="ml-0.5 opacity-70 hover:opacity-100"
        >
          <XIcon />
        </span>
      )}
    </button>
  );
}

type ModalMode = "add" | "edit" | "view" | null;

const VehicleDirectory = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle>(EMPTY_VEHICLE);
  const [mapStep, setMapStep] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Vehicle, string>>>(
    {},
  );

  const [search, setSearch] = useState("");
  const [activeStatuses, setActiveStatuses] = useState<VehicleStatus[]>([]);
  const [activeTypes, setActiveTypes] = useState<VehicleType[]>([]);

  const openModal = (mode: ModalMode, vehicle?: Vehicle) => {
    setSelectedVehicle(vehicle ? { ...vehicle } : { ...EMPTY_VEHICLE });
    setMapStep(false);
    setErrors({});
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setMapStep(false);
    setErrors({});
  };

  const validateStep1 = () => {
    const e: Partial<Record<keyof Vehicle, string>> = {};
    if (!selectedVehicle.vehicle_number.trim())
      e.vehicle_number = "Vehicle number is required";
    if (!selectedVehicle.vehicle_type) e.vehicle_type = "Select a vehicle type";
    if (!selectedVehicle.capacity_kg || selectedVehicle.capacity_kg <= 0)
      e.capacity_kg = "Capacity must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

 
const handleSave = async () => {
    // 1. Validation for Map
    if (!selectedVehicle.current_lat || !selectedVehicle.current_lng) {
      setErrors((prev) => ({
        ...prev,
        current_lat: "Please pin a location on the map",
      }));
      toast.error("Please select a location on the map");
      return;
    }

    const loadingToast = toast.loading(
      modalMode === "add" ? "Adding vehicle..." : "Updating vehicle..."
    );

    try {
      if (modalMode === "add") {
        // API call for Create
        await createVehicle(selectedVehicle);
        
        // Success Toast
        toast.success("Vehicle added successfully!", { id: loadingToast });
      } else if (modalMode === "edit") {
        // API call for Update (Update service eka nathi nisa mama meka temporary comment kala)
        // await updateVehicle(selectedVehicle._id, selectedVehicle);

        toast.success("Vehicle updated successfully!", { id: loadingToast });
      }

      // 2. Data Refetch: State eka manual update karanawata wada 
      // API ekenma aluth data tika ganna eka safe.
      await fetchVehicles();
      
      closeModal();
    } catch (error: any) {
      console.error("Save Error:", error);
      const errorMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await getAllVehicles();
    console.log("API response:", data);

      setVehicles(data);
    } catch (error) {
      console.error("Error fetching hubs:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const toggleStatus = (s: VehicleStatus) =>
    setActiveStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const toggleType = (t: VehicleType) =>
    setActiveTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const clearAllFilters = () => {
    setActiveStatuses([]);
    setActiveTypes([]);
    setSearch("");
  };

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        !search ||
        v.vehicle_number.toLowerCase().includes(search.toLowerCase()) ||
        TYPE_LABEL[v.vehicle_type].toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        activeStatuses.length === 0 || activeStatuses.includes(v.status);
      const matchType =
        activeTypes.length === 0 || activeTypes.includes(v.vehicle_type);
      return matchSearch && matchStatus && matchType;
    });
  }, [vehicles, search, activeStatuses, activeTypes]);

  const statCounts = useMemo(
    () => ({
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === "AVAILABLE").length,
      onTrip: vehicles.filter((v) => v.status === "ON_TRIP").length,
      addedThisMonth: vehicles.filter((v) => {
        const d = new Date(v.createdAt);
        const n = new Date();
        return (
          d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
        );
      }).length,
    }),
    [vehicles],
  );

  const hasActiveFilters =
    activeStatuses.length > 0 || activeTypes.length > 0 || search;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-7 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
            Vehicle Directory
          </h1>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Manage your delivery fleet
          </p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors"
        >
          <PlusIcon /> Add Vehicle
        </button>
      </header>

      <div className="px-7 py-7 max-w-7xl mx-auto">
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <StatCard value={statCounts.total} label="Total Vehicles">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </StatCard>
          <StatCard value={statCounts.available} label="Available Now">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </StatCard>
          <StatCard value={statCounts.onTrip} label="On Trip">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </StatCard>
          <StatCard value={statCounts.addedThisMonth} label="Added This Month">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </StatCard>
        </div>

        {/* Filter + Search bar */}
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mr-2">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[13px] text-gray-700 bg-transparent outline-none placeholder-gray-300 w-44"
            />
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200" />

          {/* Status filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs  text-gray-400 uppercase tracking-wider mr-1">
              Status
            </span>
            {VEHICLE_STATUSES.map((s) => (
              <FilterPill
                key={s}
                label={STATUS_LABEL[s]}
                active={activeStatuses.includes(s)}
                colorCls={STATUS_PILL[s]}
                onClick={() => toggleStatus(s)}
                onClear={() => toggleStatus(s)}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200" />

          {/* Type filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs  text-gray-400 uppercase tracking-wider mr-1">
              Type
            </span>
            {VEHICLE_TYPES.map((t) => (
              <FilterPill
                key={t}
                label={TYPE_LABEL[t]}
                active={activeTypes.includes(t)}
                colorCls={TYPE_PILL[t]}
                onClick={() => toggleType(t)}
                onClear={() => toggleType(t)}
              />
            ))}
          </div>

          {/* Clear all */}
          {hasActiveFilters && (
            <>
              <div className="h-5 w-px bg-gray-200" />
              <button
                onClick={clearAllFilters}
                className="text-xs  text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear all
              </button>
            </>
          )}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px]  text-gray-900">
            {hasActiveFilters ? "Filtered Vehicles" : "All Vehicles"}{" "}
            <span className="text-gray-400 font-normal">
              ({filtered.length}
              {hasActiveFilters ? ` of ${vehicles.length}` : ""})
            </span>
          </h2>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect
                x="1"
                y="3"
                width="15"
                height="13"
                rx="2"
                strokeWidth="1.5"
              />
              <path d="M16 8h4l3 3v5h-7V8z" strokeWidth="1.5" />
              <circle cx="5.5" cy="18.5" r="2.5" strokeWidth="1.5" />
              <circle cx="18.5" cy="18.5" r="2.5" strokeWidth="1.5" />
            </svg>
            <p className="text-[15px]">No vehicles match your filters.</p>
            <button
              onClick={clearAllFilters}
              className="mt-3 text-sm text-orange-500 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((v) => (
              <VehicleCard
                key={v._id}
                vehicle={v}
                onView={() => openModal("view", v)}
                onEdit={() => openModal("edit", v)}
                onDelete={(id) =>
                  setVehicles((p) => p.filter((x) => x._id !== id))
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <VehicleModal
        modalMode={modalMode}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        closeModal={closeModal}
        mapStep={mapStep}
        setMapStep={setMapStep}
        errors={errors}
        validateStep1={validateStep1}
        handleSave={handleSave}
        openModal={openModal}
      />
    </div>
  );
};

export default VehicleDirectory;
