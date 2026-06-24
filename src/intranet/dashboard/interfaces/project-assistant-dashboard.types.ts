import type { Order } from "@/intranet/orders/interfaces/order";
import type { Project } from "@/intranet/projects/interfaces/project";
import type { Quotation } from "@/intranet/quotation/interfaces/quotation";

export type OperationalPipelineStatus =
  | "Pendiente"
  | "Cotizado"
  | "Aprobado"
  | "En Ejecución";

export type InteractionUrgency = "alta" | "media" | "baja";

export interface OperationalPipelineRow {
  key: string;
  orderId: number | null;
  quotationId: number | null;
  projectId: number | null;
  clientName: string;
  serviceName: string;
  entryDate: string;
  status: OperationalPipelineStatus;
  canLinkProject: boolean;
  amount: number | null;
}

export interface OperationalFinancialMetrics {
  negotiationAmount: number;
  negotiationCount: number;
  reviewAmount: number;
  reviewCount: number;
  approvedReadyAmount: number;
  approvedReadyCount: number;
  estimatedRevenue: number;
  conversionRate: number;
  pipelineValue: number;
  funnelAmountStages: { label: string; value: number; color: string }[];
}

export interface InteractionFeedItem {
  id: string;
  clientName: string;
  documentLabel: string;
  messagePreview: string;
  timeAgo: string;
  urgency: InteractionUrgency;
  quotationId: number;
}

export interface OperationalKpis {
  pendingRequests: number;
  quotationsInReview: number;
  approvedQuotations: number;
  unansweredMessages: number;
}

export interface OperationalDashboardFilters {
  dateFrom: string;
  dateTo: string;
  clientQuery: string;
  statusFilter: OperationalPipelineStatus | "all";
}

export interface ProjectAssistantDashboardData {
  orders: Order[];
  quotations: Quotation[];
  projects: Project[];
  kpis: OperationalKpis;
  financial: OperationalFinancialMetrics;
  pipeline: OperationalPipelineRow[];
  interactions: InteractionFeedItem[];
  clientOptions: string[];
}

export const DEFAULT_OPERATIONAL_FILTERS: OperationalDashboardFilters = {
  dateFrom: "",
  dateTo: "",
  clientQuery: "",
  statusFilter: "all",
};
