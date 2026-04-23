import apiClient, { BASE_URL } from "../context/apiClient";
import type { CreateHubDto, Hub, UpdateHubDto } from "../types/Hubs";

export const HUB_URL = `${BASE_URL}/hubs`


export const createHub = async (dto: CreateHubDto): Promise<Hub> => {
  try {
    const { _id, ...dataToSend } = dto as any; 
    const response = await apiClient.post(`${HUB_URL}/create`, dataToSend);
    return response.data;
  } catch (error: any) {
   
    console.error("Full Backend Error:", error.response?.data || error.message);
    throw error; 
  }
};

export const getAllHubs = async (): Promise<Hub[]> => {
  const response = await apiClient.get(`${HUB_URL}/all`);
  return response.data;
};

export const getHubById = async (id: string): Promise<Hub> => {
  const response = await apiClient.get(`${HUB_URL}/findone/${id}`);
  return response.data;
};

export const updateHub = async (id: string, dto: UpdateHubDto): Promise<Hub> => {
  const response = await apiClient.patch(`${HUB_URL}/update/${id}`, dto);
  return response.data;
};


export const getCoordinates = async (address: string, city: string) => {
  const query = `${address}, ${city}, Sri Lanka`;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
  );
  const data = await response.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }
  return null;
};