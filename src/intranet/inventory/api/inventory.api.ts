import axiosInstance from "@/shared/api/axios.config";
import type { Pagination } from "@/shared/interfaces/api-response";
import type {
  InventarioItem,
  InventarioMovimiento,
  InventarioUbicacionesResponse,
} from "../interfaces/inventory.interface";
import {
  normalizeInventarioItem,
  type PaginatedResponse,
  type RawInventarioItem,
  unwrapPagination,
} from "./inventory.api.shared";

export const inventoryApi = {
  async getAll(page = 1, limit = 10): Promise<Pagination<InventarioItem[]>> {
    const response = await axiosInstance.get<PaginatedResponse<RawInventarioItem[]>>(
      "/inventario",
      {
        params: { page, limit },
      },
    );
    const pagination = unwrapPagination(response.data);

    return {
      ...pagination,
      data: pagination.data.map(normalizeInventarioItem),
    };
  },
  async getById(itemId: number): Promise<InventarioItem> {
    const response = await axiosInstance.get<RawInventarioItem>(
      `/inventario/${itemId}`,
    );
    return normalizeInventarioItem(response.data);
  },
  async create(payload: Record<string, unknown>): Promise<void> {
    await axiosInstance.post("/inventario", payload);
  },
  async update(itemId: number, payload: Record<string, unknown>): Promise<void> {
    await axiosInstance.put(`/inventario/${itemId}`, payload);
  },
  async getMovimientos(itemId: number): Promise<InventarioMovimiento[]> {
    const response = await axiosInstance.get<InventarioMovimiento[]>(
      `/inventario/${itemId}/movimientos`,
    );
    return response.data;
  },
  async getUbicaciones(itemId: number): Promise<InventarioUbicacionesResponse> {
    const response = await axiosInstance.get<InventarioUbicacionesResponse>(
      `/inventario/${itemId}/ubicaciones`,
    );
    return response.data;
  },
};
