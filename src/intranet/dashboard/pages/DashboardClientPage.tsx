import { RolesRecord } from "@/security/session/enum/roles.enum";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import ClientDashboardView from "../components/ClientDashboardView";
import ManagerDashboardView from "../components/ManagerDashboardView";
import ProjectAssistantDashboardView from "../components/ProjectAssistantDashboardView";

export default function DashboardClientPage() {
  const role = useSession((s) => s.loggedUser?.rol);

  if (role === RolesRecord.client) {
    return <ClientDashboardView />;
  }

  if (role === RolesRecord.manager) {
    return <ManagerDashboardView />;
  }

  return <ProjectAssistantDashboardView />;
}
