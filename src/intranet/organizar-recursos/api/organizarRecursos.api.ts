import axiosInstance from "@/shared/api/axios.config";
import type {
  ProyectoListResponse,
  ProyectoTodoResponse,
  InventarioListResponse,
  InventarioDelProyectoItem,
  ConductoresDisponiblesResponse,
  InventarioRequestPayload,
} from "../interfaces/proyecto";

export const organizarRecursosApi = {
  // Proyectos
  listProyectos: (page: number = 1, limit: number = 10) =>
    axiosInstance.get<ProyectoListResponse>("/proyectos", {
      params: { page, limit },
    }),

  getProyectoTodo: (id: number) =>
    axiosInstance.get<ProyectoTodoResponse>(`/proyectos/${id}/proyecto_todo`),

  // Inventario disponible (catálogo general)
  listInventario: (page: number = 1, limit: number = 10) =>
    axiosInstance.get<InventarioListResponse>("/inventario", {
      params: { page, limit },
    }),

  // Inventario asignado a un proyecto (devuelve array directo)
  getInventarioDelProyecto: (projectId: number) =>
    axiosInstance.get<InventarioDelProyectoItem[]>(
      `/proyectos/${projectId}/inventario`
    ),

  // Inventario del proyecto
  addInventarioToProyecto: (projectId: number, payload: InventarioRequestPayload) =>
    axiosInstance.post(`/proyectos/${projectId}/inventario`, payload),

  removeInventarioFromProyecto: (projectId: number, inventoryId: number) =>
    axiosInstance.delete(`/proyectos/${projectId}/inventario/${inventoryId}`),

  // Camiones del proyecto
  addCamionToProyecto: (
    projectId: number,
    payload: {
      Placa: string;
      fecha_salida: string;
      fecha_entrada: string;
      id_conductor: number;
    }
  ) => axiosInstance.post(`/proyectos/${projectId}/camiones`, payload),

  removeCamionFromProyecto: (projectId: number, camionId: number) =>
    axiosInstance.delete(`/proyectos/${projectId}/camiones/${camionId}`),

  // Conductores disponibles
  getConductoresDisponibles: (fecha: string) =>
    axiosInstance.get<ConductoresDisponiblesResponse>(
      "/perfiles/conductores/disponibles",
      {
        params: { fecha },
      }
    ),
};
