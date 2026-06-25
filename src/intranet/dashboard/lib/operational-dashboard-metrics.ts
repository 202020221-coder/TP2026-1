import { isPendingOrder } from "@/intranet/orders/api/order.api";
import type { Order } from "@/intranet/orders/interfaces/order";
import { ProjectStatesRecord } from "@/intranet/projects/enum/project-state.record";
import type { Project } from "@/intranet/projects/interfaces/project";
import { QuotationMessagesStatesRecord } from "@/intranet/quotation/enum/quotation-message-state.record";
import { QuotationStatesRecord } from "@/intranet/quotation/enum/quotation-state.record";
import type { Quotation } from "@/intranet/quotation/interfaces/quotation";
import type {
  OperationalFinancialMetrics,
  OperationalKpis,
} from "../interfaces/project-assistant-dashboard.types";

export const parseQuotationAmount = (
  value: string | number | null | undefined,
): number => {
  if (value == null) return 0;
  const parsed = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function projectByQuotationId(projects: Project[]) {
  const map = new Map<number, Project>();
  for (const project of projects) {
    if (project.id_cotizacion) map.set(project.id_cotizacion, project);
  }
  return map;
}

function sumQuotationAmounts(quotations: Quotation[]) {
  return quotations.reduce((sum, q) => sum + parseQuotationAmount(q.precioTotal), 0);
}

export function computeOperationalKpis(
  orders: Order[],
  quotations: Quotation[],
  projects: Project[],
  pendingRequestsOverride?: number,
): OperationalKpis {
  const projectMap = projectByQuotationId(projects);

  const pendingFromOrders = orders.filter(isPendingOrder).length;
  const pendingRequests = Math.max(
    pendingRequestsOverride ?? 0,
    pendingFromOrders > 0 ? pendingFromOrders : orders.length,
  );

  const reviewQuotations = quotations.filter(
    (q) =>
      q.estado === QuotationStatesRecord.pending &&
      (q.mensajes === QuotationMessagesStatesRecord.sended ||
        q.mensajes === QuotationMessagesStatesRecord.pending ||
        q.chat === "si"),
  );

  const approvedReady = quotations.filter((q) => {
    const hasProject = projectMap.has(q.ID);
    return (
      q.pendienteAprobacionOrden === true ||
      (q.estado === QuotationStatesRecord.approved && !hasProject)
    );
  });

  const unansweredMessages = quotations.filter(
    (q) => q.mensajes === QuotationMessagesStatesRecord.pending,
  ).length;

  return {
    pendingRequests,
    quotationsInReview: reviewQuotations.length,
    approvedQuotations: approvedReady.length,
    unansweredMessages,
  };
}

export function computeFinancialMetrics(
  quotations: Quotation[],
  projects: Project[],
): OperationalFinancialMetrics {
  const projectMap = projectByQuotationId(projects);

  const negotiationQuotations = quotations.filter(
    (q) =>
      q.mensajes === QuotationMessagesStatesRecord.pending ||
      q.pendienteAprobacionOrden === true,
  );

  const reviewQuotations = quotations.filter(
    (q) =>
      q.estado === QuotationStatesRecord.pending &&
      (q.mensajes === QuotationMessagesStatesRecord.sended ||
        q.mensajes === QuotationMessagesStatesRecord.pending ||
        q.chat === "si"),
  );

  const approvedReadyQuotations = quotations.filter((q) => {
    const hasProject = projectMap.has(q.ID);
    return (
      q.pendienteAprobacionOrden === true ||
      (q.estado === QuotationStatesRecord.approved && !hasProject)
    );
  });

  const approvedQuotations = quotations.filter(
    (q) => q.estado === QuotationStatesRecord.approved,
  );

  const activeQuotations = quotations.filter(
    (q) => q.estado !== QuotationStatesRecord.rejected,
  );

  const inExecutionQuotations = quotations.filter((q) => {
    const project = projectMap.get(q.ID);
    return project?.estado === ProjectStatesRecord.inExecution;
  });

  const sentQuotations = quotations.filter(
    (q) => q.estado !== QuotationStatesRecord.pending,
  );

  const conversionRate =
    sentQuotations.length > 0
      ? Math.round((approvedQuotations.length / sentQuotations.length) * 1000) / 10
      : 0;

  const pipelineValue = sumQuotationAmounts(
    activeQuotations.filter((q) => {
      const project = projectMap.get(q.ID);
      return !project || project.estado !== ProjectStatesRecord.completed;
    }),
  );

  return {
    negotiationAmount: sumQuotationAmounts(negotiationQuotations),
    negotiationCount: negotiationQuotations.length,
    reviewAmount: sumQuotationAmounts(reviewQuotations),
    reviewCount: reviewQuotations.length,
    approvedReadyAmount: sumQuotationAmounts(approvedReadyQuotations),
    approvedReadyCount: approvedReadyQuotations.length,
    estimatedRevenue: sumQuotationAmounts(approvedQuotations),
    conversionRate,
    pipelineValue,
    funnelAmountStages: [
      {
        label: "Cotizaciones activas",
        value: sumQuotationAmounts(
          quotations.filter((q) => q.estado === QuotationStatesRecord.pending),
        ),
        color: "#3b82f6",
      },
      {
        label: "En negociación",
        value: sumQuotationAmounts(negotiationQuotations),
        color: "#f59e0b",
      },
      {
        label: "Aprobadas",
        value: sumQuotationAmounts(approvedQuotations),
        color: "#10b981",
      },
      {
        label: "En ejecución",
        value: sumQuotationAmounts(inExecutionQuotations),
        color: "#8b5cf6",
      },
    ],
  };
}

export function filterOrdersByOperationalFilters(
  orders: Order[],
  filters: { dateFrom: string; dateTo: string; clientQuery: string },
): Order[] {
  return orders.filter((order) => {
    if (
      filters.clientQuery &&
      !(order.Cliente_Nombre ?? "")
        .toLowerCase()
        .includes(filters.clientQuery.toLowerCase())
    ) {
      return false;
    }
    if (filters.dateFrom || filters.dateTo) {
      const date = new Date(order.fecha_inicio);
      if (Number.isNaN(date.getTime())) return true;
      if (filters.dateFrom) {
        const start = new Date(filters.dateFrom);
        start.setHours(0, 0, 0, 0);
        if (date < start) return false;
      }
      if (filters.dateTo) {
        const end = new Date(filters.dateTo);
        end.setHours(23, 59, 59, 999);
        if (date > end) return false;
      }
    }
    return true;
  });
}

export function filterQuotationsByOperationalFilters(
  quotations: Quotation[],
  filters: { dateFrom: string; dateTo: string; clientQuery: string },
): Quotation[] {
  return quotations.filter((quotation) => {
    if (
      filters.clientQuery &&
      !(quotation.nombreCliente ?? "")
        .toLowerCase()
        .includes(filters.clientQuery.toLowerCase())
    ) {
      return false;
    }
    const dateStr = quotation.condiciones?.fechaEmision;
    if ((filters.dateFrom || filters.dateTo) && dateStr) {
      const date = new Date(dateStr);
      if (!Number.isNaN(date.getTime())) {
        if (filters.dateFrom) {
          const start = new Date(filters.dateFrom);
          start.setHours(0, 0, 0, 0);
          if (date < start) return false;
        }
        if (filters.dateTo) {
          const end = new Date(filters.dateTo);
          end.setHours(23, 59, 59, 999);
          if (date > end) return false;
        }
      }
    }
    return true;
  });
}
