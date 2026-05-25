import axiosInstance from "@/shared/api/axios.config";
import type {
  CotizacionListResponse,
  PresupuestoItem,
  TipoPresupuesto,
  AddPresupuestoItemPayload,
} from "../interfaces/presupuesto";

export const presupuestosApi = {
  listCotizaciones: (page = 1, limit = 10) =>
    axiosInstance.get<CotizacionListResponse>("/cotizaciones", {
      params: { page, limit },
    }),

  getItems: (cotizacionId: number, tipo: TipoPresupuesto) =>
    axiosInstance.get<PresupuestoItem[]>(
      `/presupuestos/cotizacion/${cotizacionId}`,
      { params: { tipo } }
    ),

  addItem: (cotizacionId: number, payload: AddPresupuestoItemPayload) =>
    axiosInstance.post(`/presupuestos/cotizacion/${cotizacionId}`, payload),

  deleteItem: (itemId: number) =>
    axiosInstance.delete(`/presupuestos/item/${itemId}`),

  updateItem: (itemId: number, payload: Partial<AddPresupuestoItemPayload>) =>
    axiosInstance.put(`/presupuestos/item/${itemId}`, payload),
};
