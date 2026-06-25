import { getPendingOrdersSummary, normalizeOrderEstado } from "@/intranet/orders/api/order.api";
import { OrderStatesRecord } from "@/intranet/orders/enum/order-state.record";
import type { Order } from "@/intranet/orders/interfaces/order";
import { getAllProjects } from "@/intranet/projects/api/project.api";
import { ProjectStatesRecord } from "@/intranet/projects/enum/project-state.record";
import type { Project } from "@/intranet/projects/interfaces/project";
import { getQuotationChatHistory } from "@/intranet/quotation/api/negotiation-chat.api";
import { getAllQuotations } from "@/intranet/quotation/api/quotation.api";
import { QuotationMessagesStatesRecord } from "@/intranet/quotation/enum/quotation-message-state.record";
import { QuotationStatesRecord } from "@/intranet/quotation/enum/quotation-state.record";
import type { Quotation } from "@/intranet/quotation/interfaces/quotation";
import type {
  InteractionFeedItem,
  InteractionUrgency,
  OperationalPipelineRow,
  OperationalPipelineStatus,
  ProjectAssistantDashboardData,
} from "../interfaces/project-assistant-dashboard.types";
import {
  computeFinancialMetrics,
  computeOperationalKpis,
  parseQuotationAmount,
} from "../lib/operational-dashboard-metrics";

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

function projectByQuotationId(projects: Project[]) {
  const map = new Map<number, Project>();
  for (const project of projects) {
    if (project.id_cotizacion) map.set(project.id_cotizacion, project);
  }
  return map;
}

function resolveRowAmount(
  quotation: Quotation | undefined,
): number | null {
  if (!quotation) return null;
  const amount = parseQuotationAmount(quotation.precioTotal);
  return amount > 0 ? amount : null;
}

function resolveQuotationStatus(
  quotation: Quotation,
  projectMap: Map<number, Project>,
): OperationalPipelineStatus {
  const linkedProject = projectMap.get(quotation.ID);
  if (
    linkedProject &&
    (linkedProject.estado === ProjectStatesRecord.inExecution ||
      linkedProject.estado === ProjectStatesRecord.pending)
  ) {
    return "En Ejecución";
  }

  if (
    quotation.estado === QuotationStatesRecord.approved ||
    quotation.pendienteAprobacionOrden === true
  ) {
    return "Aprobado";
  }

  return "Cotizado";
}

function buildPipelineRows(
  orders: Order[],
  quotations: Quotation[],
  projects: Project[],
): OperationalPipelineRow[] {
  const projectMap = projectByQuotationId(projects);
  const rows: OperationalPipelineRow[] = [];
  const usedQuotationIds = new Set<number>();

  for (const order of orders) {
    const estado = normalizeOrderEstado(order);
    if (estado && estado !== OrderStatesRecord.pending) continue;

    const linkedQuotation = quotations.find(
      (q) =>
        q.nombreCliente === order.Cliente_Nombre &&
        q.estado !== QuotationStatesRecord.rejected,
    );

    if (linkedQuotation) {
      usedQuotationIds.add(linkedQuotation.ID);
      const status = resolveQuotationStatus(linkedQuotation, projectMap);
      const linkedProject = projectMap.get(linkedQuotation.ID);
      rows.push({
        key: `order-${order.ID}-cot-${linkedQuotation.ID}`,
        orderId: order.ID,
        quotationId: linkedQuotation.ID,
        projectId: linkedProject?.id_Proyecto ?? null,
        clientName: order.Cliente_Nombre ?? linkedQuotation.nombreCliente ?? "—",
        serviceName: order.descripcion || linkedQuotation.nombre,
        entryDate: order.fecha_inicio,
        status,
        canLinkProject:
          status === "Aprobado" &&
          (linkedQuotation.pendienteAprobacionOrden === true ||
            !linkedProject),
        amount: resolveRowAmount(linkedQuotation),
      });
      continue;
    }

    rows.push({
      key: `order-${order.ID}`,
      orderId: order.ID,
      quotationId: null,
      projectId: null,
      clientName: order.Cliente_Nombre ?? "—",
      serviceName: order.descripcion,
      entryDate: order.fecha_inicio,
      status: "Pendiente",
      canLinkProject: false,
      amount: null,
    });
  }

  for (const quotation of quotations) {
    if (usedQuotationIds.has(quotation.ID)) continue;
    if (quotation.estado === QuotationStatesRecord.rejected) continue;

    const status = resolveQuotationStatus(quotation, projectMap);
    const linkedProject = projectMap.get(quotation.ID);

    rows.push({
      key: `cot-${quotation.ID}`,
      orderId: null,
      quotationId: quotation.ID,
      projectId: linkedProject?.id_Proyecto ?? null,
      clientName: quotation.nombreCliente ?? "—",
      serviceName: quotation.nombre,
      entryDate: quotation.condiciones?.fechaEmision ?? "",
      status,
      canLinkProject:
        status === "Aprobado" &&
        (quotation.pendienteAprobacionOrden === true || !linkedProject),
      amount: resolveRowAmount(quotation),
    });
  }

  return rows.sort(
    (a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(),
  );
}

async function buildInteractionFeed(
  quotations: Quotation[],
): Promise<InteractionFeedItem[]> {
  const pending = quotations.filter(
    (q) => q.mensajes === QuotationMessagesStatesRecord.pending,
  );

  const candidates = pending.slice(0, 3);
  const chatResults = await Promise.allSettled(
    candidates.map((q) => getQuotationChatHistory(q.ID)),
  );

  const items: InteractionFeedItem[] = [];

  for (let i = 0; i < candidates.length; i++) {
    const quotation = candidates[i];
    const chatResult = chatResults[i];
    const messages =
      chatResult.status === "fulfilled" ? chatResult.value : [];
    const lastMessage = messages.at(-1);

    const urgency: InteractionUrgency =
      quotation.pendienteAprobacionOrden === true
        ? "alta"
        : quotation.mensajes === QuotationMessagesStatesRecord.pending
          ? "alta"
          : "media";

    items.push({
      id: `interaction-${quotation.ID}`,
      clientName: quotation.nombreCliente ?? "Cliente",
      documentLabel: `Cotización ${quotation.nombre}`,
      messagePreview:
        lastMessage?.mensaje ??
        "El cliente tiene mensajes pendientes de respuesta.",
      timeAgo: lastMessage?.fecha_hora
        ? formatTimeAgo(lastMessage.fecha_hora)
        : "Pendiente",
      urgency,
      quotationId: quotation.ID,
    });
  }

  const sentWithoutReply = quotations
    .filter(
      (q) =>
        q.mensajes === QuotationMessagesStatesRecord.sended &&
        !items.some((item) => item.quotationId === q.ID),
    )
    .slice(0, 5);

  for (const quotation of sentWithoutReply) {
    items.push({
      id: `interaction-sent-${quotation.ID}`,
      clientName: quotation.nombreCliente ?? "Cliente",
      documentLabel: `Cotización ${quotation.nombre}`,
      messagePreview: "Conversación activa — revisar últimos mensajes del cliente.",
      timeAgo: "Reciente",
      urgency: "media",
      quotationId: quotation.ID,
    });
  }

  return items.slice(0, 12);
}

function collectClientOptions(
  orders: Order[],
  quotations: Quotation[],
  projects: Project[],
): string[] {
  const names = new Set<string>();
  for (const order of orders) {
    if (order.Cliente_Nombre) names.add(order.Cliente_Nombre);
  }
  for (const quotation of quotations) {
    if (quotation.nombreCliente) names.add(quotation.nombreCliente);
  }
  for (const project of projects) {
    if (project.Cliente_Nombre) names.add(project.Cliente_Nombre);
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b, "es"));
}

const EMPTY_KPIS = {
  pendingRequests: 0,
  quotationsInReview: 0,
  approvedQuotations: 0,
  unansweredMessages: 0,
};

async function safeBuildInteractionFeed(
  quotations: Quotation[],
): Promise<InteractionFeedItem[]> {
  try {
    const timeout = new Promise<InteractionFeedItem[]>((resolve) => {
      setTimeout(() => resolve([]), 8_000);
    });
    return await Promise.race([buildInteractionFeed(quotations), timeout]);
  } catch {
    return [];
  }
}

export async function fetchProjectAssistantDashboardData(): Promise<ProjectAssistantDashboardData> {
  try {
    const [pending, settledResults] = await Promise.all([
      getPendingOrdersSummary(),
      Promise.allSettled([
        getAllQuotations({ page: 1, limit: 500 }),
        getAllProjects({ page: 1, limit: 500 }),
      ]),
    ]);

    const orders = pending.orders;
    const pendingRequestsTotal = pending.total;

    const [quotationsSettled, projectsSettled] = settledResults;
    const quotations =
      quotationsSettled.status === "fulfilled"
        ? quotationsSettled.value.data
        : [];
    const projects =
      projectsSettled.status === "fulfilled" ? projectsSettled.value.data : [];

    const pipeline = buildPipelineRows(orders, quotations, projects);
    const interactions = await safeBuildInteractionFeed(quotations);
    const kpis = computeOperationalKpis(
      orders,
      quotations,
      projects,
      pendingRequestsTotal,
    );
    const financial = computeFinancialMetrics(quotations, projects);
    const clientOptions = collectClientOptions(orders, quotations, projects);

    return {
      orders,
      quotations,
      projects,
      kpis,
      financial,
      pipeline,
      interactions,
      clientOptions,
    };
  } catch {
    return {
      orders: [],
      quotations: [],
      projects: [],
      kpis: EMPTY_KPIS,
      financial: computeFinancialMetrics([], []),
      pipeline: [],
      interactions: [],
      clientOptions: [],
    };
  }
}
