import { useQuery } from "@tanstack/react-query";
import { fetchClientDashboardData } from "../api/client-dashboard.api";

export function useClientDashboard() {
  return useQuery({
    queryKey: ["client-dashboard"],
    queryFn: fetchClientDashboardData,
    staleTime: 60_000,
  });
}
