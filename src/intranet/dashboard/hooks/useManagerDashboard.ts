import { useQuery } from "@tanstack/react-query";
import { fetchManagerDashboardData } from "../api/dashboard.api";

export function useManagerDashboard() {
  return useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: fetchManagerDashboardData,
    staleTime: 60_000,
  });
}
