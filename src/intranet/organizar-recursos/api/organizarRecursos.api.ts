import axiosInstance from "@/shared/api/axios.config";
import type {
  ProyectoListResponse,
  ProyectoTodoResponse,
  Proyecto,
  InventarioListResponse,
  InventarioDelProyectoItem,
  Conductor,
  InventarioRequestPayload,
  Incidencia,
  Camion,
} from "../interfaces/proyecto";

export const organizarRecursosApi = {
  // Proyectos
  listProyectos: (page: number = 1, limit: number = 10) =>
    axiosInstance.get<ProyectoListResponse>("/proyectos", {
      params: { page, limit },
    }),

  getProyecto: (id: number) =>
    axiosInstance.get<Proyecto>(`/proyectos/${id}`),

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

  addInventarioToProyecto: (projectId: number, payload: InventarioRequestPayload) =>
    axiosInstance.post(`/proyectos/${projectId}/inventario`, payload),

  removeInventarioFromProyecto: (projectId: number, inventoryId: number) =>
    axiosInstance.delete(`/proyectos/${projectId}/inventario/${inventoryId}`),

  updateInventarioFromProyecto: (
    projectId: number,
    inventoryId: number,
    idObjeto: number,
    payload: Omit<InventarioRequestPayload, "Id_Objeto">
  ) =>
    axiosInstance.put(`/proyectos/${projectId}/inventario/${inventoryId}`, {
      Id_Objeto: idObjeto,
      ...payload,
    }),

  // Camiones del proyecto
  getCamionesByProyecto: (projectId: number) =>
    axiosInstance.get<Camion[]>(`/proyectos/${projectId}/camiones`),

  addCamionToProyecto: (
    projectId: number,
    payload: {
      Placa: string;
      personal_manejando: number;
      fecha_hora_salida: string;
      fecha_hora_entrada: string;
      razon: string;
      estado: string;
    }
  ) => axiosInstance.post(`/proyectos/${projectId}/camiones`, payload),

  removeCamionFromProyecto: (projectId: number, camionId: number) =>
    axiosInstance.delete(`/proyectos/${projectId}/camiones/${camionId}`),

  updateCamionFromProyecto: (
    projectId: number,
    camionId: number,
    payload: import("../interfaces/proyecto").CamionRequest
  ) =>
    axiosInstance.put(`/proyectos/${projectId}/camiones/${camionId}`, payload),

  // Conductores disponibles — devuelve array plano de Conductor[]
  getConductoresDisponibles: (fecha: string) =>
    axiosInstance.get<Conductor[]>("/perfiles/conductores/disponibles", {
      params: { fecha },
    }),

  // Incidencias por proyecto
  getIncidenciasByProyecto: (projectId: number) =>
    axiosInstance.get<Incidencia[]>(`/incidencias/proyecto/${projectId}`),

  // Todas las incidencias del sistema
  getAllIncidencias: () =>
    axiosInstance.get<Incidencia[]>("/incidencias"),
};
