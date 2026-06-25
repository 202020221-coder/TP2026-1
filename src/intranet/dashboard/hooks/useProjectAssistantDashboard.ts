import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { fetchProjectAssistantDashboardData } from "../api/project-assistant-dashboard.api";

export function useProjectAssistantDashboard() {
  const accessToken = useSession((s) => s.accessToken);

  return useQuery({
    queryKey: ["project-assistant-dashboard"],
    queryFn: fetchProjectAssistantDashboardData,
    enabled: Boolean(accessToken),
    staleTime: 30_000,
    retry: 1,
    placeholderData: (previous) => previous,
  });
}
