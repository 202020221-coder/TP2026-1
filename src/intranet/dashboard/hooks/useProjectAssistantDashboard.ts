import { useQuery } from "@tanstack/react-query";
import { fetchProjectAssistantDashboardData } from "../api/project-assistant-dashboard.api";

export function useProjectAssistantDashboard() {
  return useQuery({
    queryKey: ["project-assistant-dashboard"],
    queryFn: fetchProjectAssistantDashboardData,
    staleTime: 60_000,
  });
}
