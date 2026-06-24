import { useQuery } from "@tanstack/react-query";
import { fetchFieldSupervisorDashboardData } from "../api/field-supervisor-dashboard.api";

export function useFieldSupervisorDashboard() {
  return useQuery({
    queryKey: ["field-supervisor-dashboard"],
    queryFn: fetchFieldSupervisorDashboardData,
    staleTime: 45_000,
  });
}
