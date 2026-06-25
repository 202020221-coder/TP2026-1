import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { fetchClientDashboardData } from "../api/client-dashboard.api";

export function useClientDashboard() {
  const accessToken = useSession((s) => s.accessToken);
  const dniPerfil = useSession((s) => s.loggedUser?.dni_perfil);

  return useQuery({
    queryKey: ["client-dashboard", dniPerfil],
    queryFn: fetchClientDashboardData,
    enabled: Boolean(accessToken && dniPerfil),
    staleTime: 60_000,
    retry: 1,
    placeholderData: (previous) => previous,
  });
}
