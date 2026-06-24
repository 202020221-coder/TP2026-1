import { getAllIncidents } from "@/intranet/incidents/api/incident.api";
import type { Incident } from "@/intranet/incidents/interfaces/incident";
import { getActiveCompletedProjects } from "@/intranet/projects/api/active-projects.api";
import { getProyectoData } from "@/intranet/projects/api/project-analytics.api";
import { ProjectStatesRecord } from "@/intranet/projects/enum/project-state.record";
import type { Project } from "@/intranet/projects/interfaces/project";
import type {
  FieldSupervisorDashboardData,
  FieldSupervisorIncidentRow,
  FieldSupervisorKpis,
} from "../interfaces/field-supervisor-dashboard.types";
import {
  isOpenIncident,
  isSafetyAlert,
  mapIncidentFlowStage,
  parseIncidentMetadata,
  stripMetadataPrefix,
} from "../lib/field-supervisor-incident-utils";

function computeDayProgress(phases: { estado: string }[]): number {
  if (phases.length === 0) return 0;
  const completed = phases.filter((p) =>
    p.estado.toLowerCase().includes("complet"),
  ).length;
  const inProgress = phases.filter((p) => {
    const value = p.estado.toLowerCase();
    return (
      value.includes("proceso") ||
      value.includes("ejecución") ||
      value.includes("ejecucion") ||
      value.includes("curso")
    );
  }).length;
  return Math.round(((completed + inProgress * 0.5) / phases.length) * 100);
}

async function resolveDayProgress(projects: Project[]): Promise<number> {
  const primary =
    projects.find((p) => p.estado === ProjectStatesRecord.inExecution) ??
    projects[0];
  if (!primary) return 0;

  try {
    const detail = await getProyectoData(primary.id_Proyecto);
    return computeDayProgress(detail.etapas ?? []);
  } catch {
    if (primary.estado === ProjectStatesRecord.completed) return 100;
    if (primary.estado === ProjectStatesRecord.inExecution) return 55;
    return 20;
  }
}

function buildIncidentRows(incidents: Incident[]): FieldSupervisorIncidentRow[] {
  return [...incidents]
    .sort((a, b) => b.id_incidencia - a.id_incidencia)
    .slice(0, 8)
    .map((incident) => {
      const { category, severity } = parseIncidentMetadata(
        incident.comentario,
        incident.nombre_incidencia,
      );
      const title =
        incident.nombre_incidencia?.trim() ||
        stripMetadataPrefix(incident.comentario).slice(0, 80) ||
        `Incidencia #${incident.id_incidencia}`;

      return {
        id: incident.id_incidencia,
        projectId: incident.id_proyecto,
        projectLabel:
          incident.Cotizacion_Nombre ??
          incident.Cliente_Nombre ??
          `Proyecto #${incident.id_proyecto}`,
        title,
        flowStage: mapIncidentFlowStage(incident.estado),
        severity,
        category,
        updatedLabel: incident.estado,
      };
    });
}

function buildKpis(
  incidents: Incident[],
  dayProgressPercent: number,
): FieldSupervisorKpis {
  const openIncidents = incidents.filter(isOpenIncident).length;
  const safetyAlerts = incidents.filter(
    (i) => isOpenIncident(i) && isSafetyAlert(i),
  ).length;

  return {
    openIncidents,
    dayProgressPercent,
    safetyAlerts,
  };
}

function resolvePrimaryProject(projects: Project[]) {
  const primary =
    projects.find((p) => p.estado === ProjectStatesRecord.inExecution) ??
    projects[0];
  return {
    primaryProjectId: primary?.id_Proyecto ?? null,
    primaryClientRuc: primary?.Id_Cliente ?? null,
  };
}

export async function fetchFieldSupervisorDashboardData(): Promise<FieldSupervisorDashboardData> {
  const [incidentsResult, projects] = await Promise.all([
    getAllIncidents({ page: 1, limit: 200 }),
    getActiveCompletedProjects(),
  ]);

  const incidents = incidentsResult.data;
  const activeProjects = projects.filter(
    (p) =>
      p.estado === ProjectStatesRecord.inExecution ||
      p.estado === ProjectStatesRecord.pending,
  );
  const dayProgressPercent = await resolveDayProgress(activeProjects);
  const kpis = buildKpis(incidents, dayProgressPercent);
  const recentIncidents = buildIncidentRows(incidents);
  const { primaryProjectId, primaryClientRuc } =
    resolvePrimaryProject(activeProjects);

  return {
    projects: activeProjects,
    incidents,
    kpis,
    recentIncidents,
    primaryProjectId,
    primaryClientRuc,
  };
}
