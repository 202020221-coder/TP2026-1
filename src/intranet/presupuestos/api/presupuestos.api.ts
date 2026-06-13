import axiosInstance from "@/shared/api/axios.config";
import { getAllProjects } from "@/intranet/projects/api/project.api";
import { getIncidentsByProject } from "@/intranet/incidents/api/incident.api";
import type { Incident } from "@/intranet/incidents/interfaces/incident";
import type {
  CotizacionListResponse,
  PresupuestoItem,
  PresupuestoRealItem,
  ProyectoResumen,
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

  getIncidenciasPorCotizacion: async (
    cotizacionId: number,
  ): Promise<IncidenciaPresupuesto[]> => {
    const projects = await getAllProjects({ page: 1, limit: 1000 });
    const proyecto = projects.data.find((p) => p.id_cotizacion === cotizacionId);
    if (!proyecto) return [];

    const response = await getIncidentsByProject(proyecto.id_Proyecto);
    const raw = response.data as unknown;
    const incidents: Incident[] = Array.isArray(raw)
      ? raw
      : raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)
        ? ((raw as { data: Incident[] }).data)
        : [];

    return incidents.map((inc) => ({
      id_incidencia: inc.id_incidencia,
      comentario: inc.comentario,
      estado: inc.estado,
    }));
  },

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

  getPresupuestoReal: (
    cotizacionId: number,
    tipo: TipoPresupuesto,
    ID_Incidencia?: number,
  ) =>
    axiosInstance.get<PresupuestoRealItem[]>(
      `/presupuestos/cotizacion/${cotizacionId}/real`,
      { params: { tipo, ...(ID_Incidencia ? { ID_Incidencia } : {}) } },
    ),

  getProyecto: (proyectoId: number) =>
    axiosInstance.get<ProyectoResumen>(`/proyectos/${proyectoId}`),
};
