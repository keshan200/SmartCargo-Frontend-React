export interface Hub {
  _id: string;
  hub_name: string;
  city: string;
  address: string;
  contact_no: string;
  latitude: number;
  longitude: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHubDto {
  hub_name: string;
  city: string;
  address: string;
  contact_no: string;
  latitude: number;
  longitude: number;
}

export type UpdateHubDto = Partial<CreateHubDto>;
export type ModalMode = "add" | "edit" | "view" | null;
export type HubFormData = CreateHubDto;