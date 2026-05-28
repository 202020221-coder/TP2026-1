import axiosInstance from "@/shared/api/axios.config";
import type { TruckMaintenance } from "../interfaces/truck.interface";
import {
  normalizeTruckMaintenance,
  type RawMaintenance,
} from "./trucks.api.shared";

type CreateMaintenancePayload = {
  fecha_ultimo_mant: string;
  responsable: string;
  razon?: string | null;
  contacto_responsable: string;
};

type CreateMaintenanceResponse = {
  id: number;
  message?: string;
};

export const trucksMaintenanceApi = {
  async getMantenimientos(placa: string): Promise<TruckMaintenance[]> {
    const encodedPlaca = encodeURIComponent(placa);
    const response = await axiosInstance.get<RawMaintenance[]>(
      `/camiones/${encodedPlaca}/mantenimientos`,
    );
    return response.data.map(normalizeTruckMaintenance);
  },

  async createMantenimiento(
    placa: string,
    payload: CreateMaintenancePayload,
  ): Promise<CreateMaintenanceResponse> {
    const encodedPlaca = encodeURIComponent(placa);
    const response = await axiosInstance.post<CreateMaintenanceResponse>(
      `/camiones/${encodedPlaca}/mantenimientos`,
      payload,
    );
    return response.data;
  },

  async uploadMantenimientoPdf(
    placa: string,
    maintenanceId: number,
    file: File,
  ): Promise<string | null> {
    const encodedPlaca = encodeURIComponent(placa);
    const formData = new FormData();
    formData.append("pdf_mantenimiento", file);
    const response = await axiosInstance.post<{ url?: string }>(
      `/camiones/${encodedPlaca}/mantenimientos/${maintenanceId}/pdf`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data?.url ?? null;
  },
};
