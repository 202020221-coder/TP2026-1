import axiosInstance from "@/shared/api/axios.config";
import type { ProyectoEtapa, IncidenciaResumen, Informe } from "@/intranet/informes/interfaces/informe";
import type { Incident } from "@/intranet/incidents/interfaces/incident";
import type { InvolvedObject } from "@/intranet/incidents/interfaces/incident-quotation";
import type { PresupuestoRealItem, TipoPresupuesto } from "@/intranet/presupuestos/interfaces/presupuesto";

export interface ProjectAnalytics {
  etapas: ProyectoEtapa[];
  incidencias: IncidenciaResumen[];
  informes: Informe[];
  incidents: Incident[];
  incidentObjects: Record<number, InvolvedObject[]>;
  cotizacionId: number | null;
  presupuestoReal: Record<string, PresupuestoRealItem[]>;
}

export interface ProyectoData {
  id_Proyecto: number;
  descripcion_servicio: string;
  id_cotizacion?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado: string;
  Proyecto_Nombre?: string;
  Cliente_Nombre?: string;
  Cotizacion_Nombre?: string;
  etapas: ProyectoEtapa[];
}

export async function getProyectoData(idProyecto: number): Promise<ProyectoData> {
  const response = await axiosInstance.get(`/proyectos/${idProyecto}`);
  return response.data as ProyectoData;
}

export async function getIncidenciasDelProyecto(idProyecto: number): Promise<IncidenciaResumen[]> {
  const response = await axiosInstance.get(`/proyectos/${idProyecto}/incidencias`);
  const data = response.data;
  if (Array.isArray(data)) return data as IncidenciaResumen[];
  if (data && typeof data === "object" && Array.isArray((data as Record<string, unknown>).data))
    return (data as Record<string, unknown>).data as IncidenciaResumen[];
  return [];
}

export async function getInformesDelProyecto(idProyecto: number): Promise<Informe[]> {
  const response = await axiosInstance.get(`/proyectos/${idProyecto}/informes?limit=1000`);
  const data = response.data;
  if (Array.isArray(data)) return data as Informe[];
  if (data && typeof data === "object" && Array.isArray((data as Record<string, unknown>).data))
    return (data as Record<string, unknown>).data as Informe[];
  return [];
}

export async function getIncidentsByProject(idProyecto: number): Promise<Incident[]> {
  const response = await axiosInstance.get(`/incidencias/proyecto/${idProyecto}`);
  const data = response.data as { data?: Incident[] };
  return Array.isArray(data.data) ? data.data : [];
}

export async function getIncidentObjects(idIncidencia: number): Promise<InvolvedObject[]> {
  const response = await axiosInstance.get(`/incidencias/${idIncidencia}/objetos`);
  const data = response.data;
  const raw = Array.isArray(data) ? data : (data as Record<string, unknown>).data ?? [];
  return (raw as InvolvedObject[]).filter((o) => o.id > 0);
}

export async function getCotizacionId(idProyecto: number): Promise<number | null> {
  const response = await axiosInstance.get(`/proyectos/${idProyecto}`);
  const data = response.data as { id_cotizacion?: number };
  return data.id_cotizacion ?? null;
}

export async function getPresupuestoReal(
  cotizacionId: number,
  tipo: TipoPresupuesto,
  ID_Incidencia?: number,
): Promise<PresupuestoRealItem[]> {
  const params: Record<string, string | number> = { tipo };
  if (ID_Incidencia) params.ID_Incidencia = ID_Incidencia;
  const response = await axiosInstance.get(`/presupuestos/cotizacion/${cotizacionId}/real`, { params });
  const data = response.data;
  if (Array.isArray(data)) return data as PresupuestoRealItem[];
  if (data && typeof data === "object" && Array.isArray((data as Record<string, unknown>).data))
    return (data as Record<string, unknown>).data as PresupuestoRealItem[];
  return [];
}

