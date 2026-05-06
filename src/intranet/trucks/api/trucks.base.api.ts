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
};
