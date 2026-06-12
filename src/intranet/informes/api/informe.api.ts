import axiosInstance from "@/shared/api/axios.config";
import type {
  Informe,
  ProyectoEtapa,
  IncidenciaResumen,
} from "../interfaces/informe";

// ── Informes CRUD ────────────────────────────────────────────────────────────

export interface GetInformesFilters {
  nombre?: string;
  id_incidencia?: number;
  relacion?: "ninguna";
}

export interface CreateInformeBody {
  nombre?: string;
  fecha: string;
  hora: string;
  descripcion?: string;
  ubicacion?: string;
  relacion?: string;
  id_incidencia?: number | null;
  id_proyecto_etapa?: number | null;
  id_proyecto_actividad?: number | null;
}

export interface UpdateInformeBody {
  fecha?: string;
  hora?: string;
  descripcion?: string;
  relacion?: string;
  id_incidencia?: number | null;
  id_proyecto_etapa?: number | null;
  id_proyecto_actividad?: number | null;
}

/** Listar informes del proyecto (con filtros opcionales) */
export async function getInformes(
  idProyecto: number,
  filters?: GetInformesFilters,
): Promise<Informe[]> {
  const params = new URLSearchParams();
  params.set("limit", "1000"); // Avoid backend defaulting to 10 limit
  if (filters?.nombre) params.set("nombre", filters.nombre);
  if (filters?.id_incidencia)
    params.set("id_incidencia", String(filters.id_incidencia));
  if (filters?.relacion) params.set("relacion", filters.relacion);

  const qs = params.toString();
  const url = `/proyectos/${idProyecto}/informes${qs ? `?${qs}` : ""}`;
  const response = await axiosInstance.get<Informe[]>(url);
  return response.data;
}

/** Crear un informe / suceso */
export async function createInforme(
  idProyecto: number,
  body: CreateInformeBody,
): Promise<Informe> {
  const response = await axiosInstance.post<Informe>(
    `/proyectos/${idProyecto}/informes`,
    body,
  );
  return response.data;
}

/** Actualizar un informe */
export async function updateInforme(
  idProyecto: number,
  idInforme: number,
  body: UpdateInformeBody,
): Promise<Informe> {
  const response = await axiosInstance.put<Informe>(
    `/proyectos/${idProyecto}/informes/${idInforme}`,
    body,
  );
  return response.data;
}

/** Eliminar un informe */
export async function deleteInforme(
  idProyecto: number,
  idInforme: number,
): Promise<void> {
  await axiosInstance.delete(`/proyectos/${idProyecto}/informes/${idInforme}`);
}

// ── Evidencia ────────────────────────────────────────────────────────────────

/** Subir foto de evidencia (PNG/JPEG) */
export async function uploadEvidencia(
  idProyecto: number,
  idInforme: number,
  file: File,
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("evidencia", file);
  // No enviar Content-Type manualmente — el navegador lo configura con el boundary
  const response = await axiosInstance.post<{ message: string; url: string }>(
    `/proyectos/${idProyecto}/informes/${idInforme}/evidencia`,
    formData,
  );
  return response.data;
}

/** Obtener URL completa de la evidencia para mostrar en <img> */
export function getEvidenciaUrl(idProyecto: number, idInforme: number): string {
  // La API base incluye /api, pero la evidencia se sirve desde la raíz del backend
  const apiUrl = import.meta.env.VITE_API_URL as string; // e.g. "https://swefire.onrender.com/api"
  const baseUrl = apiUrl.replace(/\/api\/?$/, ""); // → "https://swefire.onrender.com"
  return `${baseUrl}/api/proyectos/${idProyecto}/informes/${idInforme}/evidencia`;
}

/** Construir URL para una ruta de evidencia guardada en BD (e.g. /uploads/informes/foto_xxx.png) */
export function getEvidenciaStaticUrl(rutaEvidencia: string): string {
  const apiUrl = import.meta.env.VITE_API_URL as string;
  const baseUrl = apiUrl.replace(/\/api\/?$/, "");
  return `${baseUrl}${rutaEvidencia}`;
}

// ── Datos auxiliares (etapas, actividades, incidencias del proyecto) ──────

interface ProyectoConEtapas {
  id_Proyecto: number;
  Proyecto_Nombre: string;
  Cliente_Nombre?: string;
  etapas: ProyectoEtapa[];
  [key: string]: unknown;
}

/** Obtener proyecto con sus etapas y actividades */
export async function getProyectoConEtapas(
  idProyecto: number,
): Promise<ProyectoConEtapas> {
  const response = await axiosInstance.get<ProyectoConEtapas>(
    `/proyectos/${idProyecto}`,
  );
  return response.data;
}

/** Obtener incidencias del proyecto */
export async function getIncidenciasDelProyecto(
  idProyecto: number,
): Promise<IncidenciaResumen[]> {
  const response = await axiosInstance.get<IncidenciaResumen[]>(
    `/proyectos/${idProyecto}/incidencias`,
  );
  return response.data;
}
