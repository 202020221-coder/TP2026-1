import axiosInstance from "@/shared/api/axios.config";
import { toSearchParams } from "@/shared/lib/to-search-params";
import type { GetIncidentsQP } from "../interfaces/query-params.dto";
import type {
  GetIncidentsResponse,
  GetIncidentResponse,
  GetIncidentObjectsResponse,
  GetIncidentInvolvedResponse,
} from "../interfaces/responses.dto";

// ── Interfaces para cuerpos de petición ─────────────────────────────────────

export interface CreateIncidentBody {
  id_proyecto: number;
  empresa_involucrada: string;
  cotizacion_remuneracion?: number | null;
  comentario: string;
  estado?: string;
}

export interface UpdateIncidentBody {
  id: number;
  empresa_involucrada?: string;
  cotizacion_remuneracion?: number | null;
  comentario?: string;
  estado?: string;
}

export interface CreateIncidentObjectBody {
  tipo: string;
  descripcion: string;
}

export interface CreateIncidentInvolvedBody {
  nombre: string;
  rol: string;
}

// ── Incidencias ──────────────────────────────────────────────────────────────

/** Listar todas las incidencias */
export async function getAllIncidents(params: GetIncidentsQP) {
  const response = await axiosInstance.get<GetIncidentsResponse>(
    `/incidencias?${toSearchParams(params)}`,
  );
  return response.data;
}

/** Obtener incidencia por ID */
export async function getIncidentById(id: number) {
  const response = await axiosInstance.get<GetIncidentResponse>(
    `/incidencias/${id}`,
  );
  return response.data;
}

/** Obtener incidencias por ID de proyecto */
export async function getIncidentsByProject(id_proyecto: number) {
  const response = await axiosInstance.get<GetIncidentsResponse>(
    `/incidencias/proyecto/${id_proyecto}`,
  );
  return response.data;
}

/** Crear incidencia */
export async function createIncident(body: CreateIncidentBody): Promise<void> {
  await axiosInstance.post(`/incidencias`, body);
}

/** Actualizar incidencia */
export async function updateIncident(body: UpdateIncidentBody): Promise<void> {
  const { id, ...rest } = body;
  await axiosInstance.put(`/incidencias/${id}`, rest);
}

/** Eliminar incidencia */
export async function deleteIncident(id: number): Promise<void> {
  await axiosInstance.delete(`/incidencias/${id}`);
}

// ── Objetos de incidencia ────────────────────────────────────────────────────

/** Listar objetos y camiones de la incidencia */
export async function getIncidentObjects(id: number) {
  const response = await axiosInstance.get<GetIncidentObjectsResponse>(
    `/incidencias/${id}/objetos`,
  );
  return response.data;
}

/** Agregar objeto/camión a incidencia */
export async function addIncidentObject(
  id: number,
  body: CreateIncidentObjectBody,
): Promise<void> {
  await axiosInstance.post(`/incidencias/${id}/objetos`, body);
}

/** Eliminar objeto de incidencia */
export async function deleteIncidentObject(
  id: number,
  oid: number,
): Promise<void> {
  await axiosInstance.delete(`/incidencias/${id}/objetos/${oid}`);
}

// ── Involucrados de incidencia ────────────────────────────────────────────────

/** Listar involucrados de la incidencia */
export async function getIncidentInvolved(id: number) {
  const response = await axiosInstance.get<GetIncidentInvolvedResponse>(
    `/incidencias/${id}/involucrados`,
  );
  return response.data;
}

/** Agregar involucrado a incidencia */
export async function addIncidentInvolved(
  id: number,
  body: CreateIncidentInvolvedBody,
): Promise<void> {
  await axiosInstance.post(`/incidencias/${id}/involucrados`, body);
}

/** Eliminar involucrado de incidencia */
export async function deleteIncidentInvolved(
  id: number,
  ivid: number,
): Promise<void> {
  await axiosInstance.delete(`/incidencias/${id}/involucrados/${ivid}`);
}
