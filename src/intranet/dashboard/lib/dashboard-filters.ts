import { useMemo } from "react";
import { ProjectStatesRecord } from "@/intranet/projects/enum/project-state.record";
import type { ProjectState } from "@/intranet/projects/enum/project-state.record";
import { OrderStatesRecord } from "@/intranet/orders/enum/order-state.record";
import { QuotationStatesRecord } from "@/intranet/quotation/enum/quotation-state.record";
import { QuotationMessagesStatesRecord } from "@/intranet/quotation/enum/quotation-message-state.record";
import { IncidentStatesRecord } from "@/intranet/incidents/enum/incident-state.record";
import type {
  DashboardFilters,
  FunnelStage,
  ManagerDashboardData,
} from "../interfaces/manager-dashboard.types";

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const inDateRange = (dateStr: string | undefined | null, from: string, to: string) => {
  const d = parseDate(dateStr);
  if (!d) return true;
  if (from) {
    const f = parseDate(from);
    if (f && d < f) return false;
  }
  if (to) {
    const t = parseDate(`${to}T23:59:59`);
    if (t && d > t) return false;
  }
  return true;
};

const matchesClient = (clientName: string | undefined, query: string) => {
  if (!query.trim()) return true;
  return (clientName ?? "").toLowerCase().includes(query.trim().toLowerCase());
};

const emptyStateCounts = (): Record<ProjectState, number> => ({
  [ProjectStatesRecord.pending]: 0,
  [ProjectStatesRecord.inExecution]: 0,
  [ProjectStatesRecord.completed]: 0,
  [ProjectStatesRecord.legalProcess]: 0,
  [ProjectStatesRecord.cancelled]: 0,
});

export function applyDashboardFilters(
  data: ManagerDashboardData,
  filters: DashboardFilters,
): ManagerDashboardData {
  const { dateFrom, dateTo, clientQuery, projectId } = filters;

  let projects = data.projects;
  let orders = data.orders;
  let quotations = data.quotations;
  let incidents = data.incidents;

  if (projectId != null) {
    const project = projects.find((p) => p.id_Proyecto === projectId);
    projects = project ? [project] : [];
    incidents = incidents.filter((i) => i.id_proyecto === projectId);
    if (project?.id_cotizacion) {
      quotations = quotations.filter((q) => q.ID === project.id_cotizacion);
    }
  }

  if (clientQuery.trim()) {
    projects = projects.filter((p) => matchesClient(p.Cliente_Nombre, clientQuery));
    orders = orders.filter((o) => matchesClient(o.Cliente_Nombre, clientQuery));
    quotations = quotations.filter((q) => matchesClient(q.nombreCliente, clientQuery));
    incidents = incidents.filter((i) => matchesClient(i.Cliente_Nombre, clientQuery));
  }

  if (dateFrom || dateTo) {
    projects = projects.filter((p) => inDateRange(p.fecha_inicio, dateFrom, dateTo));
    orders = orders.filter((o) => inDateRange(o.fecha_inicio, dateFrom, dateTo));
  }

  const projectsByState = emptyStateCounts();
  for (const p of projects) {
    if (p.estado in projectsByState) projectsByState[p.estado as ProjectState] += 1;
  }

  const activeProjects = projects.filter(
    (p) => p.estado === ProjectStatesRecord.inExecution,
  );

  const openIncidentsList = incidents.filter(
    (i) => i.estado !== IncidentStatesRecord.cerrado,
  );

  const approvedQuotations = quotations.filter(
    (q) => q.estado === QuotationStatesRecord.approved,
  );
  const sentQuotations = quotations.filter(
    (q) => q.estado !== QuotationStatesRecord.pending,
  );

  const parseAmount = (v: string) => parseFloat(v) || 0;

  const funnelStages: FunnelStage[] = [
    { label: "Solicitudes", value: orders.length, color: "#f59e0b" },
    { label: "Cotizaciones", value: quotations.length, color: "#3b82f6" },
    { label: "Aprobadas", value: approvedQuotations.length, color: "#10b981" },
    {
      label: "En ejecución",
      value: projectsByState[ProjectStatesRecord.inExecution],
      color: "#8b5cf6",
    },
  ];

  const negotiationQuotations = quotations.filter(
    (q) =>
      q.mensajes === QuotationMessagesStatesRecord.pending ||
      q.pendienteAprobacionOrden === true,
  );

  const mermaByProject = data.mermaByProject.filter((row) => {
    if (projectId != null && row.projectId !== projectId) return false;
    if (clientQuery.trim() && !matchesClient(row.clientName, clientQuery)) return false;
    return true;
  });

  const legalBottlenecks = data.legalBottlenecks.filter((row) => {
    if (clientQuery.trim() && !matchesClient(row.clientName, clientQuery)) return false;
    if (projectId != null && row.type === "proyecto" && row.id !== projectId) return false;
    return true;
  });

  return {
    ...data,
    projects,
    orders,
    quotations,
    incidents,
    totalProjects: projects.length,
    projectsByState,
    activeProjects,
    pendingOrders: orders.filter((o) => o.estado === OrderStatesRecord.pending).length,
    recentPendingOrders: orders
      .filter((o) => o.estado === OrderStatesRecord.pending)
      .slice(0, 5),
    pendingQuotations: quotations.filter((q) => q.estado === QuotationStatesRecord.pending)
      .length,
    pendingOcQuotations: quotations.filter((q) => q.pendienteAprobacionOrden).slice(0, 5),
    pendingOcApproval: quotations.filter((q) => q.pendienteAprobacionOrden).length,
    openIncidents: openIncidentsList.length,
    recentIncidents: openIncidentsList.slice(0, 5),
    estimatedRevenue: approvedQuotations.reduce((s, q) => s + parseAmount(q.precioTotal), 0),
    conversionRate:
      sentQuotations.length > 0
        ? Math.round((approvedQuotations.length / sentQuotations.length) * 1000) / 10
        : 0,
    negotiationAmount: negotiationQuotations.reduce(
      (s, q) => s + parseAmount(q.precioTotal),
      0,
    ),
    negotiationCount: negotiationQuotations.length,
    funnelStages,
    mermaByProject,
    legalBottlenecks: legalBottlenecks.slice(0, 5),
    criticalIncidentsToday: openIncidentsList.filter(
      (i) =>
        i.estado === IncidentStatesRecord.enRevision ||
        i.estado === IncidentStatesRecord.enviado,
    ).length,
  };
}

export function useFilteredDashboard(
  data: ManagerDashboardData | undefined,
  filters: DashboardFilters,
) {
  return useMemo(
    () => (data ? applyDashboardFilters(data, filters) : undefined),
    [data, filters],
  );
}
