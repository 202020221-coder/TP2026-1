import axiosInstance from "@/shared/api/axios.config";
import type { Pagination } from "@/shared/interfaces/api-response";
import type {
  TruckInventoryDetail,
  TruckInventoryItem,
  TruckInventoryRow,
} from "../interfaces/truck.interface";
import {
  normalizeTruckInventoryDetail,
  normalizeTruckInventoryItem,
  normalizeTruckInventoryRow,
  unwrapPagination,
  type PaginatedResponse,
  type RawInventoryDetail,
  type RawInventoryItem,
  type RawInventoryRow,
} from "./trucks.api.shared";

export const trucksInventoryApi = {
  async getInventarioByCamion(placa: string): Promise<TruckInventoryRow[]> {
    const encodedPlaca = encodeURIComponent(placa);
    const response = await axiosInstance.get<RawInventoryRow[]>(
      `/camiones/${encodedPlaca}/inventario`,
    );
    return response.data.map(normalizeTruckInventoryRow);
  },

  async getInventarioCatalog(
    params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {},
  ): Promise<Pagination<TruckInventoryDetail[]>> {
    const { page = 1, limit = 200, search } = params;
    const response = await axiosInstance.get<PaginatedResponse<RawInventoryDetail[]>>(
      "/inventario",
      {
        params: {
          page,
          limit,
          search,
        },
      },
    );

    const pagination = unwrapPagination(response.data);
    return {
      ...pagination,
      data: pagination.data.map(normalizeTruckInventoryDetail),
    };
  },

  async asignarItem(placa: string, payload: TruckInventoryItem): Promise<TruckInventoryItem> {
    const encodedPlaca = encodeURIComponent(placa);
    const response = await axiosInstance.post<RawInventoryItem>(
      `/camiones/${encodedPlaca}/inventario`,
      payload,
    );
    return normalizeTruckInventoryItem(response.data);
  },

  async getInventarioPorId(itemId: number): Promise<TruckInventoryDetail> {
    const response = await axiosInstance.get<RawInventoryDetail>(`/inventario/${itemId}`);
    return normalizeTruckInventoryDetail(response.data);
  },

  async desasignarItem(placa: string, itemId: number): Promise<void> {
    const encodedPlaca = encodeURIComponent(placa);
    await axiosInstance.delete(`/camiones/${encodedPlaca}/inventario/${itemId}`);
  },
};
