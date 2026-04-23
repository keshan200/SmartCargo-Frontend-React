

export type VehicleType = 'BIKE' | 'VAN' | 'TRUCK';

export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

// Vehicle  create 
export interface CreateVehicleDto {
    
  vehicle_number: string;
  vehicle_type: VehicleType;
  capacity_kg: number;
  current_lat?: number;
  current_lng?: number;
  assigned_hub_id?: string;
}


export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {
  status?: VehicleStatus;
  current_driver_id?: string;
}


export interface Vehicle extends CreateVehicleDto {
  _id: string;
  status: VehicleStatus;
  current_driver_id: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}