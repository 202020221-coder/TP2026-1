import {
  getAllOrders,
  normalizeOrdersResponse,
} from "@/intranet/orders/api/order.api";
import { OrderStatesRecord } from "@/intranet/orders/enum/order-state.record";
import type { Order } from "@/intranet/orders/interfaces/order";
import { getClientProjects } from "@/intranet/projects/api/client-projects.api";
import { getProyectoData } from "@/intranet/projects/api/project-analytics.api";
import { ProjectStatesRecord } from "@/intranet/projects/enum/project-state.record";
import type { Project } from "@/intranet/projects/interfaces/project";
import type { ProyectoEtapa } from "@/intranet/informes/interfaces/informe";
import { getQuotationChatHistory } from "@/intranet/quotation/api/negotiation-chat.api";
import { getAllQuotations } from "@/intranet/quotation/api/quotation.api";
import { QuotationMessagesStatesRecord } from "@/intranet/quotation/enum/quotation-message-state.record";
import { QuotationStatesRecord } from "@/intranet/quotation/enum/quotation-state.record";
import type { Quotation } from "@/intranet/quotation/interfaces/quotation";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { isQuotationAwaitingClientAction } from "@/intranet/quotation/lib/client-quotation-state";
import { parseQuotationAmount } from "../lib/operational-dashboard-metrics";
import type {
  ClientDashboardData,
  ClientDashboardKpis,
  ClientProjectProgress,
  ClientQuotationSummary,
  ClientRecentMessage,
  ClientRequestSummary,
  ClientTimelinePhase,
  TimelinePhaseStatus,
} from "../interfaces/client-dashboard.types";

const EMPTY_KPIS: ClientDashboardKpis = {
  quotationsToApprove: 0,
  pendingMessages: 0,
  openRequests: 0,
};

const DASHBOARD_LIST_LIMIT = 100;

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Reciente";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.max(1, Math.floor(diffMs / 60_000));
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} día${days === 1 ? "" : "s"}`;
}

function mapEtapaStatus(estado: string): TimelinePhaseStatus {
  const value = estado.toLowerCase();
  if (value.includes("complet")) return "completed";
  if (
    value.includes("proceso") ||
    value.includes("ejecución") ||
    value.includes("ejecucion") ||
    value.includes("curso") ||
    value.includes("activ")
  ) {
    return "in_progress";
  }
  return "pending";
}

function buildTimelinePhases(etapas: ProyectoEtapa[]): ClientTimelinePhase[] {
  return [...etapas]
    .sort((a, b) => a.orden - b.orden)
    .map((etapa) => ({
      id: etapa.id,
      name: etapa.nombre,
      status: mapEtapaStatus(etapa.estado),
      order: etapa.orden,
    }));
}

function computeProgressPercent(phases: ClientTimelinePhase[]): number {
  if (phases.length === 0) return 0;
  const completed = phases.filter((p) => p.status === "completed").length;
  const inProgress = phases.filter((p) => p.status === "in_progress").length;
  const partial = inProgress > 0 ? 0.5 : 0;
  return Math.round(((completed + partial) / phases.length) * 100);
}

function resolveNextMilestone(
  etapas: ProyectoEtapa[],
): { label: string | null; date: string | null } {
  const sorted = [...etapas].sort((a, b) => a.orden - b.orden);
  for (const etapa of sorted) {
    if (mapEtapaStatus(etapa.estado) !== "completed") {
      const pendingActivity = etapa.actividades?.find(
        (a) => mapEtapaStatus(a.estado) !== "completed",
      );
      return {
        label: pendingActivity?.nombre ?? etapa.nombre,
        date: null,
      };
    }
  }
  return { label: null, date: null };
}

async function buildProjectProgress(
  projects: Project[],
): Promise<ClientProjectProgress | null> {
  const primary =
    projects.find((p) => p.estado === ProjectStatesRecord.inExecution) ??
    projects.find((p) => p.estado === ProjectStatesRecord.pending) ??
    projects[0];

  if (!primary) return null;

  try {
    const detail = await getProyectoData(primary.id_Proyecto);
    const phases = buildTimelinePhases(detail.etapas ?? []);
    const milestone = resolveNextMilestone(detail.etapas ?? []);

    return {
      projectId: primary.id_Proyecto,
      projectName:
        primary.Cotizacion_Nombre ??
        primary.descripcion_servicio ??
        `Proyecto #${primary.id_Proyecto}`,
      projectStatus: primary.estado,
      progressPercent: computeProgressPercent(phases),
      phases,
      nextMilestone: milestone.label,
      nextMilestoneDate: milestone.date ?? primary.fecha_fin ?? null,
    };
  } catch {
    return {
      projectId: primary.id_Proyecto,
      projectName:
        primary.Cotizacion_Nombre ??
        primary.descripcion_servicio ??
        `Proyecto #${primary.id_Proyecto}`,
      projectStatus: primary.estado,
      progressPercent:
        primary.estado === ProjectStatesRecord.completed
          ? 100
          : primary.estado === ProjectStatesRecord.inExecution
            ? 50
            : 15,
      phases: [],
      nextMilestone: primary.descripcion_servicio,
      nextMilestoneDate: primary.fecha_fin ?? null,
    };
  }
}

function buildKpis(orders: Order[], quotations: Quotation[]): ClientDashboardKpis {
  const quotationsToApprove = quotations.filter(
    (q) =>
      isQuotationAwaitingClientAction(q) &&
      !q.ordenCompra &&
      q.mensajes !== QuotationMessagesStatesRecord.pending,
  ).length;

  const pendingMessages = quotations.filter(
    (q) => q.mensajes === QuotationMessagesStatesRecord.pending,
  ).length;

  const openRequests = orders.filter(
    (o) => o.estado === OrderStatesRecord.pending,
  ).length;

  return { quotationsToApprove, pendingMessages, openRequests };
}

function mapQuotationStatus(quotation: Quotation): ClientQuotationSummary {
  const awaitingAction =
    isQuotationAwaitingClientAction(quotation) && !quotation.ordenCompra;

  let status = "En revisión";
  let statusTone: ClientQuotationSummary["statusTone"] = "neutral";

  if (quotation.estado === QuotationStatesRecord.approved) {
    status = "Aprobada";
    statusTone = "success";
  } else if (quotation.estado === QuotationStatesRecord.rejected) {
    status = "Rechazada";
    statusTone = "danger";
  } else if (awaitingAction) {
    status = "Pendiente (sin proyecto)";
    statusTone = "warning";
  } else if (quotation.estado === QuotationStatesRecord.pending) {
    status = "En evaluación";
    statusTone = "neutral";
  }

  return {
    id: quotation.ID,
    name: quotation.nombre,
    amount: parseQuotationAmount(quotation.precioTotal),
    status,
    statusTone,
    needsAction: awaitingAction,
  };
}

function mapRequestStatus(order: Order): ClientRequestSummary {
  let status = "En análisis";
  let statusTone: ClientRequestSummary["statusTone"] = "neutral";

  if (order.estado === OrderStatesRecord.approved) {
    status = "Aceptada";
    statusTone = "success";
  } else if (order.estado === OrderStatesRecord.rejected) {
    status = "Cerrada";
    statusTone = "danger";
  } else if (order.estado === OrderStatesRecord.pending) {
    status = "En análisis";
    statusTone = "warning";
  }

  return {
    id: order.ID,
    description: order.descripcion,
    date: order.fecha_inicio,
    status,
    statusTone,
  };
}

async function safeBuildRecentMessages(
  quotations: Quotation[],
): Promise<ClientRecentMessage[]> {
  try {
    const timeout = new Promise<ClientRecentMessage[]>((resolve) => {
      setTimeout(() => resolve([]), 8_000);
    });
    return await Promise.race([buildRecentMessages(quotations), timeout]);
  } catch {
    return [];
  }
}

async function buildRecentMessages(
  quotations: Quotation[],
): Promise<ClientRecentMessage[]> {
  const candidates = quotations
    .filter(
      (q) =>
        q.mensajes === QuotationMessagesStatesRecord.pending ||
        q.mensajes === QuotationMessagesStatesRecord.sended,
    )
    .slice(0, 4);

  const results = await Promise.allSettled(
    candidates.map((q) => getQuotationChatHistory(q.ID)),
  );

  const messages: ClientRecentMessage[] = [];

  for (let i = 0; i < candidates.length; i++) {
    const quotation = candidates[i];
    const chatResult = results[i];
    const chat =
      chatResult.status === "fulfilled" ? chatResult.value : [];
    const last = chat.at(-1);

    messages.push({
      id: `msg-${quotation.ID}`,
      quotationId: quotation.ID,
      quotationName: quotation.nombre,
      preview:
        last?.mensaje ??
        "Hay una conversación activa sobre esta cotización.",
      timeAgo: last?.fecha_hora ? formatTimeAgo(last.fecha_hora) : "Reciente",
      needsClientReply:
        quotation.mensajes === QuotationMessagesStatesRecord.pending,
    });
  }

  return messages.slice(0, 5);
}

async function loadClientOrders(): Promise<Order[]> {
  try {
    const response = await getAllOrders({
      page: 1,
      limit: DASHBOARD_LIST_LIMIT,
    });
    return normalizeOrdersResponse(response).data;
  } catch {
    return [];
  }
}

async function loadClientQuotations(): Promise<Quotation[]> {
  try {
    const response = await getAllQuotations({
      page: 1,
      per_page: DASHBOARD_LIST_LIMIT,
    });
    return response.data ?? [];
  } catch {
    return [];
  }
}

function buildEmptyClientDashboard(): ClientDashboardData {
  return {
    orders: [],
    quotations: [],
    projects: [],
    kpis: EMPTY_KPIS,
    primaryProgress: null,
    recentMessages: [],
    quotationSummaries: [],
    requestSummaries: [],
    primaryQuotationToApprove: null,
  };
}

export async function fetchClientDashboardData(): Promise<ClientDashboardData> {
  const user = useSession.getState().loggedUser;
  if (!user?.dni_perfil) {
    return buildEmptyClientDashboard();
  }

  try {
    const [ordersSettled, quotationsSettled, projectsSettled] =
      await Promise.allSettled([
        loadClientOrders(),
        loadClientQuotations(),
        getClientProjects(user.dni_perfil),
      ]);

    const orders =
      ordersSettled.status === "fulfilled" ? ordersSettled.value : [];
    const quotations =
      quotationsSettled.status === "fulfilled" ? quotationsSettled.value : [];
    const projects =
      projectsSettled.status === "fulfilled" ? projectsSettled.value : [];

    const kpis = buildKpis(orders, quotations);
    const primaryProgress = await buildProjectProgress(projects);
    const recentMessages = await safeBuildRecentMessages(quotations);

    const quotationSummaries = [...quotations]
      .sort((a, b) => b.ID - a.ID)
      .slice(0, 6)
      .map(mapQuotationStatus);

    const requestSummaries = [...orders]
      .sort((a, b) => b.ID - a.ID)
      .slice(0, 6)
      .map(mapRequestStatus);

    const primaryQuotationToApprove =
      quotations.find(
        (q) => isQuotationAwaitingClientAction(q) && !q.ordenCompra,
      ) ?? null;

    return {
      orders,
      quotations,
      projects,
      kpis,
      primaryProgress,
      recentMessages,
      quotationSummaries,
      requestSummaries,
      primaryQuotationToApprove,
    };
  } catch {
    return buildEmptyClientDashboard();
  }
}
