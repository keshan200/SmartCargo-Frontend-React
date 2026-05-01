import apiClient, { BASE_URL } from "../context/apiClient";
import type { ShipmentForm, Shipment } from "../types/shipment";

export const SHIPMENT_URL = `${BASE_URL}/shipments`;



export const createShipment = async (shipmentData: ShipmentForm): Promise<Shipment> => {
  const response = await apiClient.post(`${SHIPMENT_URL}/create`, shipmentData);
  return response.data;
};