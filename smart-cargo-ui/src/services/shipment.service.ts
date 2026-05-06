import apiClient, { BASE_URL } from "../context/apiClient";
import type { ShipmentForm, Shipment } from "../types/shipment";

export const SHIPMENT_URL = `${BASE_URL}/shipments`;



export const createShipment = async (shipmentData: ShipmentForm): Promise<Shipment> => {
  const response = await apiClient.post(`${SHIPMENT_URL}/create`, shipmentData);
  return response.data;
};


export const allshipments = async (): Promise<Shipment[]> => {
  const response = await apiClient.get(`${SHIPMENT_URL}/all`);
  console.log("[shipment.service] allshipments response", response);
  const data = response.data;
  console.log("[shipment.service] allshipments data", data);

  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.shipments && Array.isArray(data.shipments)) return data.shipments;

  return [];
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
  const response = await apiClient.get(`${SHIPMENT_URL}/${id}`);
  return response.data;
};