import type { Project } from "@/intranet/projects/interfaces/project";
import type { ProjectState } from "@/intranet/projects/enum/project-state.record";
import type { Quotation } from "@/intranet/quotation/interfaces/quotation";
import type { Incident } from "@/intranet/incidents/interfaces/incident";
import type { Order } from "@/intranet/orders/interfaces/order";
import type { Truck } from "@/intranet/trucks/interfaces/truck.interface";
import type { InventarioItem } from "@/intranet/inventory/interfaces/inventory.interface";

export interface InventoryAlerts {
  maintenanceRequired: number;
  damaged: number;
  zeroStock: number;
}

export interface FunnelStage {
  label: string;
  value: number;
  color: string;
}

export interface MermaProjectRow {
  projectId: number;
  projectName: string;
  clientName: string;
  mermaPercent: number;
  isCritical: boolean;
}

export interface LegalBottleneckRow {
  id: number;
  type: "proyecto" | "incidencia";
  label: string;
  clientName: string;
  status: string;
  priority: "critico" | "medio" | "bajo";
}

export interface MarginSummary {
  budgeted: number;
  actual: number;
  marginPercent: number;
}

export interface FleetSummary {
  total: number;
  operational: number;
  onRoute: number;
  availabilityPercent: number;
}

export interface ManagerDashboardData {
  projects: Project[];
  orders: Order[];
  quotations: Quotation[];
  incidents: Incident[];
  trucks: Truck[];
  inventoryItems: InventarioItem[];

  totalProjects: number;
  projectsByState: Record<ProjectState, number>;
  activeProjects: Project[];

  pendingOrders: number;
  recentPendingOrders: Order[];
  pendingQuotations: number;
  pendingOcApproval: number;
  pendingOcQuotations: Quotation[];

  openIncidents: number;
  recentIncidents: Incident[];
  inventoryAlerts: InventoryAlerts;
  estimatedRevenue: number;

  conversionRate: number;
  negotiationAmount: number;
  negotiationCount: number;
  marginSummary: MarginSummary;
  funnelStages: FunnelStage[];

  globalMermaPercent: number;
  mermaByProject: MermaProjectRow[];
  fleetSummary: FleetSummary;
  maintenanceDelayDays: number;
  overdueTrucksCount: number;

  legalBottlenecks: LegalBottleneckRow[];
  criticalIncidentsToday: number;
}

export interface DashboardFilters {
  dateFrom: string;
  dateTo: string;
  clientQuery: string;
  projectId: number | null;
}

export const DASHBOARD_THRESHOLDS = {
  mermaCritical: 10,
  conversionLow: 35,
  fleetLow: 70,
  marginLow: 15,
} as const;
