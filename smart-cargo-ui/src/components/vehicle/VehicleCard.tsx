import { EyeIcon, EditIcon, TrashIcon } from "lucide-react";
import type { UpdateVehicleDto, Vehicle, VehicleType } from "../../types/Vehicle";



const TYPE_ICON: Record<VehicleType, string> = {
  BIKE: "🛵",
  VAN: "🚐",
  TRUCK: "🚛",
};

const TYPE_LABEL: Record<VehicleType, string> = {
  BIKE: "Bike",
  VAN: "Van",
  TRUCK: "Truck",
};



interface VehicleCardProps {
  vehicle: Vehicle;
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: UpdateVehicleDto) => void;
  onDelete: (id: string) => void;
}


export const VehicleCard = ({ vehicle, onView, onEdit, onDelete }: VehicleCardProps) => {
  const handleEdit = () => {
    const dto: UpdateVehicleDto = {
      vehicle_number: vehicle.vehicle_number,
      vehicle_type: vehicle.vehicle_type,
      capacity_kg: vehicle.capacity_kg,
      current_lat: vehicle.current_lat,
      current_lng: vehicle.current_lng,
      assigned_hub_id: vehicle.assigned_hub_id,
      status: vehicle.status,
      current_driver_id: vehicle.current_driver_id ?? undefined,
    };
    onEdit(dto);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200 group font-['Poppins',sans-serif]">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-[17px] font-semibold text-gray-900 tracking-tight">{vehicle.vehicle_number}</h3>
          

        <div className="flex gap-1">
          <button
            onClick={() => onView(vehicle)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(vehicle._id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 rounded-md mb-4">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
          <span className="text-[12px] font-semibold text-orange-700">
            {TYPE_LABEL[vehicle.vehicle_type]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Capacity</p>
            <p className="text-[15px] font-medium text-gray-700">{vehicle.capacity_kg.toLocaleString()} kg</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Status</p>
            <p className="text-[15px] font-semibold text-green-600">● Active</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
          <span className="text-[12px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">GPS</span>
          <span className="text-[13px] text-gray-500 font-mono">{vehicle.current_lat}, {vehicle.current_lng}</span>
        </div>

        <p className="text-[11px] text-gray-300 text-right mt-3 font-normal">
          Added {new Date(vehicle.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};