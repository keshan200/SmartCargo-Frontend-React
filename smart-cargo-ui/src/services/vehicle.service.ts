import apiClient, { BASE_URL } from "../context/apiClient";
import type { CreateVehicleDto, Vehicle } from "../types/Vehicle";

export const VEHICLE_URL = `${BASE_URL}/vehicles`



export const createVehicle = async (dto: CreateVehicleDto): Promise<CreateVehicleDto> => {
  try {
    const { _id, ...dataToSend } = dto as any; 
    const response = await apiClient.post(`${VEHICLE_URL}/create`, dataToSend);
    return response.data;
    
  } catch (error: any) {
    console.error("Vehicle Create Error:", error.response?.data || error.message);
    throw error;
  }
};




export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const response = await apiClient.get(`${VEHICLE_URL}/all`);
  
  return response.data.data;
};

