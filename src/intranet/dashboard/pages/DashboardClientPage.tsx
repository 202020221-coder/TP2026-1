import { RolesRecord } from "@/security/session/enum/roles.enum";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import ClientDashboardView from "../components/ClientDashboardView";
import FieldSupervisorDashboardView from "../components/FieldSupervisorDashboardView";
import ManagerDashboardView from "../components/ManagerDashboardView";
import ProjectAssistantDashboardView from "../components/ProjectAssistantDashboardView";

export default function DashboardClientPage() {
  const role = useSession((s) => s.loggedUser?.rol);

  if (role === RolesRecord.client) {
    return <ClientDashboardView />;
  }

  if (role === RolesRecord.fieldSupervisor) {
    return <FieldSupervisorDashboardView />;
  }

  if (role === RolesRecord.manager) {
    return <ManagerDashboardView />;
  }

  if (role === RolesRecord.projectAdmin) {
    return <ProjectAssistantDashboardView />;
  }

  return <ManagerDashboardView />;
}
