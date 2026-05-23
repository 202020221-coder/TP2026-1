import axiosInstance from "@/shared/api/axios.config";
import type {
  PresupuestoListResponse,
  Presupuesto,
  MaterialDirecto,
  ManoObra,
  ServicioPresupuesto,
  GastoAdmin,
} from "../interfaces/presupuesto";

export const presupuestosApi = {
  list: (page = 1, limit = 10) =>
    axiosInstance.get<PresupuestoListResponse>("/presupuestos", {
      params: { page, limit },
    }),

  getById: (id: number) =>
    axiosInstance.get<Presupuesto>(`/presupuestos/${id}`),

  // Material Directo
  getMaterialDirecto: (presupuestoId: number) =>
    axiosInstance.get<MaterialDirecto[]>(
      `/presupuestos/${presupuestoId}/material-directo`
    ),
  addMaterialDirecto: (
    presupuestoId: number,
    payload: { nombre: string; costo: number }
  ) =>
    axiosInstance.post(
      `/presupuestos/${presupuestoId}/material-directo`,
      payload
    ),
  deleteMaterialDirecto: (presupuestoId: number, sid: number) =>
    axiosInstance.delete(
      `/presupuestos/${presupuestoId}/material-directo/${sid}`
    ),

  // Mano de Obra
  getManoObra: (presupuestoId: number) =>
    axiosInstance.get<ManoObra[]>(`/presupuestos/${presupuestoId}/mano-obra`),
  addManoObra: (
    presupuestoId: number,
    payload: {
      profesion_ejercida: string;
      costo_x_hora: number;
      costo_general: number;
    }
  ) =>
    axiosInstance.post(`/presupuestos/${presupuestoId}/mano-obra`, payload),
  deleteManoObra: (presupuestoId: number, sid: number) =>
    axiosInstance.delete(`/presupuestos/${presupuestoId}/mano-obra/${sid}`),

  // Servicios
  getServicios: (presupuestoId: number) =>
    axiosInstance.get<ServicioPresupuesto[]>(
      `/presupuestos/${presupuestoId}/servicios`
    ),
  addServicio: (
    presupuestoId: number,
    payload: { nombre_servicio: string; costo: number }
  ) =>
    axiosInstance.post(`/presupuestos/${presupuestoId}/servicios`, payload),
  deleteServicio: (presupuestoId: number, sid: number) =>
    axiosInstance.delete(`/presupuestos/${presupuestoId}/servicios/${sid}`),

  // Gastos Administrativos
  getGastosAdmin: (presupuestoId: number) =>
    axiosInstance.get<GastoAdmin[]>(
      `/presupuestos/${presupuestoId}/gastos-admin`
    ),
  addGastoAdmin: (
    presupuestoId: number,
    payload: { nombre_gasto: string; costo: number }
  ) =>
    axiosInstance.post(`/presupuestos/${presupuestoId}/gastos-admin`, payload),
  deleteGastoAdmin: (presupuestoId: number, sid: number) =>
    axiosInstance.delete(
      `/presupuestos/${presupuestoId}/gastos-admin/${sid}`
    ),
};
