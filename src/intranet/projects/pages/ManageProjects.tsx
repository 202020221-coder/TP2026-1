
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { canEditProjects } from "@/intranet/layout/sidebar-links";
import { ProjectsTable } from "../components";
import { ListProjectsProvider } from "../context/ListProjectsProvider";

export function ProjectsManagementPage() {
  const role = useSession((state) => state.loggedUser?.rol);
  const canEdit = canEditProjects(role);

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestionar Proyectos</h1>
      </div>
      <ListProjectsProvider>
        <div className="bg-card p-6 rounded-xl shadow-xs border flex flex-col flex-1 min-h-0">
          <ProjectsTable canEdit={canEdit} />
        </div>
      </ListProjectsProvider>
    </>
  );
}
