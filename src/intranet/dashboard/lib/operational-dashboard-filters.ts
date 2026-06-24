import type {
  OperationalDashboardFilters,
  ProjectAssistantDashboardData,
} from "../interfaces/project-assistant-dashboard.types";
import {
  computeFinancialMetrics,
  computeOperationalKpis,
  filterOrdersByOperationalFilters,
  filterQuotationsByOperationalFilters,
} from "./operational-dashboard-metrics";

function inDateRange(dateStr: string, from: string, to: string): boolean {
  if (!dateStr) return true;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return true;
  if (from) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    if (date < start) return false;
  }
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    if (date > end) return false;
  }
  return true;
}

export function applyOperationalFilters(
  data: ProjectAssistantDashboardData | undefined,
  filters: OperationalDashboardFilters,
): ProjectAssistantDashboardData | undefined {
  if (!data) return undefined;

  let pipeline = data.pipeline;

  if (filters.clientQuery) {
    const query = filters.clientQuery.toLowerCase();
    pipeline = pipeline.filter((row) =>
      row.clientName.toLowerCase().includes(query),
    );
  }

  if (filters.statusFilter !== "all") {
    pipeline = pipeline.filter((row) => row.status === filters.statusFilter);
  }

  if (filters.dateFrom || filters.dateTo) {
    pipeline = pipeline.filter((row) =>
      inDateRange(row.entryDate, filters.dateFrom, filters.dateTo),
    );
  }

  let interactions = data.interactions;
  if (filters.clientQuery) {
    const query = filters.clientQuery.toLowerCase();
    interactions = interactions.filter((item) =>
      item.clientName.toLowerCase().includes(query),
    );
  }

  const filteredOrders = filterOrdersByOperationalFilters(data.orders, filters);
  const filteredQuotations = filterQuotationsByOperationalFilters(
    data.quotations,
    filters,
  );

  const hasGlobalFilters =
    Boolean(filters.clientQuery) ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo);

  const kpis = hasGlobalFilters
    ? computeOperationalKpis(filteredOrders, filteredQuotations, data.projects)
    : data.kpis;

  const financial = hasGlobalFilters
    ? computeFinancialMetrics(filteredQuotations, data.projects)
    : data.financial;

  return {
    ...data,
    kpis,
    financial,
    pipeline,
    interactions,
  };
}
