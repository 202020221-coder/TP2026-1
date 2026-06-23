import { getAllProjects } from "@/intranet/projects/api/project.api";
import { getActiveCompletedProjects } from "@/intranet/projects/api/active-projects.api";
import { getPresupuestoReal } from "@/intranet/projects/api/project-analytics.api";
import { ProjectStatesRecord } from "@/intranet/projects/enum/project-state.record";
import type { ProjectState } from "@/intranet/projects/enum/project-state.record";
import type { Project } from "@/intranet/projects/interfaces/project";
import { getAllOrders } from "@/intranet/orders/api/order.api";
import { OrderStatesRecord } from "@/intranet/orders/enum/order-state.record";
import { getAllQuotations } from "@/intranet/quotation/api/quotation.api";
import { QuotationStatesRecord } from "@/intranet/quotation/enum/quotation-state.record";
import { QuotationMessagesStatesRecord } from "@/intranet/quotation/enum/quotation-message-state.record";
import { getAllIncidents } from "@/intranet/incidents/api/incident.api";
import { IncidentStatesRecord } from "@/intranet/incidents/enum/incident-state.record";
import { inventoryApi } from "@/intranet/inventory/api/inventory.api";
import { trucksBaseApi } from "@/intranet/trucks/api/trucks.base.api";
import type { TipoPresupuesto } from "@/intranet/presupuestos/interfaces/presupuesto";
import type {
  FunnelStage,
  LegalBottleneckRow,
  ManagerDashboardData,
  MarginSummary,
  MermaProjectRow,
} from "../interfaces/manager-dashboard.types";
import type { Incident } from "@/intranet/incidents/interfaces/incident";

const BUDGET_TYPES: TipoPresupuesto[] = [
  "Material Directo",
  "Mano de Obra",
  "Servicios",
  "Gastos Administrativos",
];

const EMPTY_STATE_COUNTS = (): Record<ProjectState, number> => ({
  [ProjectStatesRecord.pending]: 0,
  [ProjectStatesRecord.inExecution]: 0,
  [ProjectStatesRecord.completed]: 0,
  [ProjectStatesRecord.legalProcess]: 0,
  [ProjectStatesRecord.cancelled]: 0,
});

const parseAmount = (value: string | number | null | undefined): number => {
  if (value == null) return 0;
  const parsed = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const daysBetween = (from: Date, to: Date) =>
  Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

async function computeMarginAndMerma(
  projects: Project[],
): Promise<{ margin: MarginSummary; mermaRows: MermaProjectRow[] }> {
  const candidates = projects
    .filter((p) => p.id_cotizacion && p.estado === ProjectStatesRecord.inExecution)
    .slice(0, 8);

  let totalBudgeted = 0;
  let totalActual = 0;
  const mermaRows: MermaProjectRow[] = [];

  const results = await Promise.allSettled(
    candidates.map(async (project) => {
      const cotId = project.id_cotizacion!;
      const tipoResults = await Promise.allSettled(
        BUDGET_TYPES.map((tipo) => getPresupuestoReal(cotId, tipo)),
      );

      let budgeted = 0;
      let actual = 0;
      let materialBudget = 0;
      let materialActual = 0;

      for (let i = 0; i < BUDGET_TYPES.length; i++) {
        const tipo = BUDGET_TYPES[i];
        const r = tipoResults[i];
        if (r.status !== "fulfilled") continue;
        for (const item of r.value) {
          const cost = parseAmount(item.costo_total);
          const real = parseAmount(item.costo_real ?? "0");
          budgeted += cost;
          actual += real;
          if (tipo === "Material Directo") {
            materialBudget += cost;
            materialActual += real;
          }
        }
      }

      const mermaPercent =
        materialBudget > 0
          ? Math.max(0, ((materialActual - materialBudget) / materialBudget) * 100)
          : 0;

      return {
        project,
        budgeted,
        actual,
        mermaPercent,
      };
    }),
  );

  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    totalBudgeted += r.value.budgeted;
    totalActual += r.value.actual;
    if (r.value.mermaPercent > 0 || r.value.budgeted > 0) {
      mermaRows.push({
        projectId: r.value.project.id_Proyecto,
        projectName:
          r.value.project.Cotizacion_Nombre ?? r.value.project.descripcion_servicio,
        clientName: r.value.project.Cliente_Nombre ?? "—",
        mermaPercent: Math.round(r.value.mermaPercent * 10) / 10,
        isCritical: r.value.mermaPercent > 10,
      });
    }
  }

  mermaRows.sort((a, b) => b.mermaPercent - a.mermaPercent);

  const marginPercent =
    totalBudgeted > 0
      ? Math.round(((totalBudgeted - totalActual) / totalBudgeted) * 1000) / 10
      : 0;

  return {
    margin: {
      budgeted: totalBudgeted,
      actual: totalActual,
      marginPercent,
    },
    mermaRows: mermaRows.slice(0, 6),
  };
}

function buildLegalBottlenecks(projects: Project[], incidents: Incident[]): LegalBottleneckRow[] {
  const rows: LegalBottleneckRow[] = [];

  for (const project of projects.filter(
    (p) => p.estado === ProjectStatesRecord.legalProcess,
  )) {
    rows.push({
      id: project.id_Proyecto,
      type: "proyecto",
      label: project.Cotizacion_Nombre ?? project.descripcion_servicio,
      clientName: project.Cliente_Nombre ?? "—",
      status: "En proceso legal",
      priority: "critico",
    });
  }

  for (const incident of incidents.filter((i) => i.estado !== IncidentStatesRecord.cerrado)) {
    rows.push({
      id: incident.id_incidencia,
      type: "incidencia",
      label: incident.nombre_incidencia ?? `Incidencia #${incident.id_incidencia}`,
      clientName: incident.Cliente_Nombre,
      status: incident.estado,
      priority:
        incident.estado === IncidentStatesRecord.enRevision ? "critico" : "medio",
    });
  }

  return rows.slice(0, 5);
}

function countProjectsByState(projects: Project[]) {
  const counts = EMPTY_STATE_COUNTS();
  for (const project of projects) {
    if (project.estado in counts) {
      counts[project.estado as ProjectState] += 1;
    }
  }
  return counts;
}

export async function fetchManagerDashboardData(): Promise<ManagerDashboardData> {
  const [
    projectsResult,
    activeProjectsResult,
    allOrdersResult,
    pendingOrdersResult,
    recentOrdersResult,
    allQuotationsResult,
    pendingQuotationsResult,
    pendingOcResult,
    incidentsResult,
    inventoryResult,
    trucksResult,
  ] = await Promise.allSettled([
    getAllProjects({ page: 1, limit: 500 }),
    getActiveCompletedProjects(),
    getAllOrders({ page: 1, limit: 500 }),
    getAllOrders({ page: 1, limit: 1, estado: OrderStatesRecord.pending }),
    getAllOrders({ page: 1, limit: 5, estado: OrderStatesRecord.pending }),
    getAllQuotations({ page: 1, limit: 500 }),
    getAllQuotations({ page: 1, limit: 1, estado: QuotationStatesRecord.pending }),
    getAllQuotations({ page: 1, limit: 5, pendiente_aprobacion: true }),
    getAllIncidents({ page: 1, limit: 200 }),
    inventoryApi.getAll(1, 500),
    trucksBaseApi.getAll(1, 200),
  ]);

  const projects =
    projectsResult.status === "fulfilled" ? projectsResult.value.data : [];
  const activeProjectsRaw =
    activeProjectsResult.status === "fulfilled" ? activeProjectsResult.value : [];
  const orders =
    allOrdersResult.status === "fulfilled" ? allOrdersResult.value.data : [];
  const quotations =
    allQuotationsResult.status === "fulfilled" ? allQuotationsResult.value.data : [];
  const incidents =
    incidentsResult.status === "fulfilled" ? incidentsResult.value.data : [];
  const inventoryItems =
    inventoryResult.status === "fulfilled" ? inventoryResult.value.data : [];
  const trucks = trucksResult.status === "fulfilled" ? trucksResult.value.data : [];

  const projectsByState = countProjectsByState(projects);
  const totalProjects = projects.length;

  const activeProjects = activeProjectsRaw.filter(
    (p) => p.estado === ProjectStatesRecord.inExecution,
  );

  const pendingOrders =
    pendingOrdersResult.status === "fulfilled"
      ? pendingOrdersResult.value.pagination.total
      : orders.filter((o) => o.estado === OrderStatesRecord.pending).length;

  const recentPendingOrders =
    recentOrdersResult.status === "fulfilled" ? recentOrdersResult.value.data : [];

  const pendingQuotations =
    pendingQuotationsResult.status === "fulfilled"
      ? pendingQuotationsResult.value.pagination.total
      : quotations.filter((q) => q.estado === QuotationStatesRecord.pending).length;

  const pendingOcQuotations =
    pendingOcResult.status === "fulfilled" ? pendingOcResult.value.data : [];

  const pendingOcApproval =
    pendingOcResult.status === "fulfilled"
      ? pendingOcResult.value.pagination.total
      : pendingOcQuotations.length;

  const openIncidentsList = incidents.filter(
    (i) => i.estado !== IncidentStatesRecord.cerrado,
  );

  const inventoryAlerts = {
    maintenanceRequired: inventoryItems.filter((i) => i.mant_requerimiento === "si").length,
    damaged: inventoryItems.filter((i) => i.estado === "malogrado").length,
    zeroStock: inventoryItems.filter((i) => i.cantidad <= 0).length,
  };

  const totalMerma = inventoryItems.reduce((s, i) => s + (i.merma_perdida ?? 0), 0);
  const totalStock = inventoryItems.reduce((s, i) => s + Math.max(i.cantidad, 0), 0);
  const globalMermaPercent =
    totalStock > 0 ? Math.round((totalMerma / (totalStock + totalMerma)) * 1000) / 10 : 0;

  const approvedQuotations = quotations.filter(
    (q) => q.estado === QuotationStatesRecord.approved,
  );
  const estimatedRevenue = approvedQuotations.reduce(
    (sum, q) => sum + parseAmount(q.precioTotal),
    0,
  );

  const sentQuotations = quotations.filter(
    (q) => q.estado !== QuotationStatesRecord.pending,
  );
  const conversionRate =
    sentQuotations.length > 0
      ? Math.round((approvedQuotations.length / sentQuotations.length) * 1000) / 10
      : 0;

  const negotiationQuotations = quotations.filter(
    (q) =>
      q.mensajes === QuotationMessagesStatesRecord.pending ||
      q.pendienteAprobacionOrden === true,
  );
  const negotiationAmount = negotiationQuotations.reduce(
    (sum, q) => sum + parseAmount(q.precioTotal),
    0,
  );

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

  const operational = trucks.filter((t) => t.Estado === "Operacional").length;
  const onRoute = trucks.filter((t) => t.Estado === "Ocupado").length;
  const fleetTotal = trucks.length;
  const availabilityPercent =
    fleetTotal > 0
      ? Math.round(((operational + onRoute) / fleetTotal) * 1000) / 10
      : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let maintenanceDelayDays = 0;
  let overdueTrucksCount = 0;
  for (const truck of trucks) {
    const revision = new Date(truck.fecha_prox_revision);
    if (Number.isNaN(revision.getTime())) continue;
    if (revision < today) {
      overdueTrucksCount += 1;
      const delay = daysBetween(revision, today);
      if (delay > maintenanceDelayDays) maintenanceDelayDays = delay;
    }
  }

  const { margin: marginSummary, mermaRows: mermaByProject } =
    await computeMarginAndMerma(projects);

  const legalBottlenecks = buildLegalBottlenecks(projects, incidents);

  const criticalIncidentsToday = openIncidentsList.filter((i) => {
    return (
      i.estado === IncidentStatesRecord.enRevision ||
      i.estado === IncidentStatesRecord.enviado
    );
  }).length;

  return {
    projects,
    orders,
    quotations,
    incidents,
    trucks,
    inventoryItems,
    totalProjects,
    projectsByState,
    activeProjects,
    pendingOrders,
    recentPendingOrders,
    pendingQuotations,
    pendingOcApproval,
    pendingOcQuotations,
    openIncidents: openIncidentsList.length,
    recentIncidents: openIncidentsList.slice(0, 5),
    inventoryAlerts,
    estimatedRevenue,
    conversionRate,
    negotiationAmount,
    negotiationCount: negotiationQuotations.length,
    marginSummary,
    funnelStages,
    globalMermaPercent,
    mermaByProject,
    fleetSummary: {
      total: fleetTotal,
      operational,
      onRoute,
      availabilityPercent,
    },
    maintenanceDelayDays,
    overdueTrucksCount,
    legalBottlenecks,
    criticalIncidentsToday,
  };
}
