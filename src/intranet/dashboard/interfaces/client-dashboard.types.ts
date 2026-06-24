import type { Order } from "@/intranet/orders/interfaces/order";
import type { Project } from "@/intranet/projects/interfaces/project";
import type { Quotation } from "@/intranet/quotation/interfaces/quotation";

export interface ClientDashboardKpis {
  quotationsToApprove: number;
  pendingMessages: number;
  openRequests: number;
}

export interface ClientRecentMessage {
  id: string;
  quotationId: number;
  quotationName: string;
  preview: string;
  timeAgo: string;
  needsClientReply: boolean;
}

export interface ClientQuotationSummary {
  id: number;
  name: string;
  amount: number;
  status: string;
  statusTone: "success" | "warning" | "neutral" | "danger";
  needsAction: boolean;
}

export interface ClientRequestSummary {
  id: number;
  description: string;
  date: string;
  status: string;
  statusTone: "success" | "warning" | "neutral" | "danger";
}

export type TimelinePhaseStatus = "completed" | "in_progress" | "pending";

export interface ClientTimelinePhase {
  id: number;
  name: string;
  status: TimelinePhaseStatus;
  order: number;
}

export interface ClientProjectProgress {
  projectId: number;
  projectName: string;
  projectStatus: string;
  progressPercent: number;
  phases: ClientTimelinePhase[];
  nextMilestone: string | null;
  nextMilestoneDate: string | null;
}

export interface ClientDashboardData {
  orders: Order[];
  quotations: Quotation[];
  projects: Project[];
  kpis: ClientDashboardKpis;
  primaryProgress: ClientProjectProgress | null;
  recentMessages: ClientRecentMessage[];
  quotationSummaries: ClientQuotationSummary[];
  requestSummaries: ClientRequestSummary[];
  primaryQuotationToApprove: Quotation | null;
}
