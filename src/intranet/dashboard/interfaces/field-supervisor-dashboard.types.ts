import type { Incident } from "@/intranet/incidents/interfaces/incident";
import type { Project } from "@/intranet/projects/interfaces/project";

export type IncidentSeverity = "Baja" | "Media" | "Alta" | "Crítica";

export type IncidentCategory =
  | "Seguridad"
  | "Retraso de material"
  | "Desviación técnica"
  | "Clima"
  | "Otro";

export type IncidentFlowStage =
  | "Reportada"
  | "En revisión"
  | "En proceso"
  | "Cerrada";

export interface FieldSupervisorKpis {
  openIncidents: number;
  dayProgressPercent: number;
  safetyAlerts: number;
}

export interface FieldSupervisorIncidentRow {
  id: number;
  projectId: number;
  projectLabel: string;
  title: string;
  flowStage: IncidentFlowStage;
  severity: IncidentSeverity | null;
  category: IncidentCategory | null;
  updatedLabel: string;
}

export interface FieldSupervisorDashboardData {
  projects: Project[];
  incidents: Incident[];
  kpis: FieldSupervisorKpis;
  recentIncidents: FieldSupervisorIncidentRow[];
  primaryProjectId: number | null;
  primaryClientRuc: string | null;
}
