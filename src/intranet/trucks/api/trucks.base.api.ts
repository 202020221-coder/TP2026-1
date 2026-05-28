import axiosInstance from "@/shared/api/axios.config";
import type { Pagination } from "@/shared/interfaces/api-response";
import type { RegisterTruckPayload, Truck } from "../interfaces/truck.interface";
import {
  normalizeTruck,
  type PaginatedResponse,
  type RawTruck,
  unwrapPagination,
} from "./trucks.api.shared";

export const trucksBaseApi = {
  async getAll(page = 1, limit = 10): Promise<Pagination<Truck[]>> {
    const response = await axiosInstance.get<PaginatedResponse<RawTruck[]>>("/camiones", {
      params: { page, limit },
    });
    const pagination = unwrapPagination(response.data);

    return {
      ...pagination,
      data: pagination.data.map(normalizeTruck),
    };
  },

  async getByPlaca(placa: string): Promise<Truck> {
    const encodedPlaca = encodeURIComponent(placa);
    const response = await axiosInstance.get<RawTruck>(`/camiones/${encodedPlaca}`);
    return normalizeTruck(response.data);
  },

  async registerTruck(payload: RegisterTruckPayload): Promise<void> {
    await axiosInstance.post("/camiones", payload);
  },

  async updateTruck(placa: string, payload: Partial<Truck>): Promise<void> {
    const encodedPlaca = encodeURIComponent(placa);
    await axiosInstance.put(`/camiones/${encodedPlaca}`, payload);
  },

  async uploadRevisionTecnica(placa: string, file: File): Promise<string | null> {
    const encodedPlaca = encodeURIComponent(placa);
    const formData = new FormData();
    formData.append("revision_tecnica", file);
    const response = await axiosInstance.post<{ url?: string }>(
      `/camiones/${encodedPlaca}/revision-tecnica`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data?.url ?? null;
  },

  async uploadTarjetaPropiedad(placa: string, file: File): Promise<string | null> {
    const encodedPlaca = encodeURIComponent(placa);
    const formData = new FormData();
    formData.append("tarjeta_propiedad", file);
    const response = await axiosInstance.post<{ url?: string }>(
      `/camiones/${encodedPlaca}/tarjeta-propiedad`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data?.url ?? null;
  },
};
