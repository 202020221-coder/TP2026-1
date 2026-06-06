import axiosInstance from "@/shared/api/axios.config";
import type {
  CotizacionListResponse,
  PresupuestoItem,
  TipoPresupuesto,
  AddPresupuestoItemPayload,
  GastoRealPayload,
  IncidenciaPresupuesto,
  InventarioPorServicioPresupuestoResponse,
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

  updateGastoReal: (itemId: number, payload: GastoRealPayload, file?: File) => {
    const formData = new FormData();
    if (payload.gasto_real !== undefined) formData.append("costo_real", payload.gasto_real);
    if (payload.precio_real !== undefined) formData.append("precio_real", payload.precio_real);
    if (payload.aumentos !== undefined) formData.append("aumentos", payload.aumentos);
    if (payload.razon_gasto_real !== undefined) formData.append("razon", payload.razon_gasto_real);
    if (payload.involucra_incidencia && payload.involucra_incidencia !== "NO")
      formData.append("ID_Incidencia", payload.involucra_incidencia);
    if (file) formData.append("prueba", file);
    return axiosInstance.put(`/presupuestos/item/${itemId}/gasto-real`, formData);
  },

  getIncidencias: () =>
    axiosInstance.get<IncidenciaPresupuesto[]>("/incidencias"),

  getOrdenCompraPdf: (cotizacionId: number) =>
    axiosInstance.get(`/cotizaciones/${cotizacionId}/orden-compra`, {
      responseType: "blob",
    }),

  getInventarioPorServicio: (cotizacionId: number) =>
    axiosInstance.get<InventarioPorServicioPresupuestoResponse>(
      `/cotizaciones/${cotizacionId}/inventario-por-servicio`
    ),

  exportarFaltantesInventario: (cotizacionId: number) =>
    axiosInstance.post(
      `/presupuestos/cotizacion/${cotizacionId}/faltantes-inventario/exportar`
    ),
};
