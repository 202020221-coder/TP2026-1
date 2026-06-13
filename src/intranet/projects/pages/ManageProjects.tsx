import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { canEditProjects } from "@/intranet/layout/sidebar-links";
import { useState } from "react";
import { ProjectsTable } from "../components";
import { ListProjectsProvider } from "../context/ListProjectsProvider";
import { ActiveProjectsTable } from "../components/ActiveProjectsTable";
import { ClientProjectsTable } from "../components/ClientProjectsTable";
import { Button } from "@/shared/components/ui/button";
import { PlayCircle, LayoutList } from "lucide-react";
import { RolesRecord } from "@/security/session/enum/roles.enum";

export function ProjectsManagementPage() {
  const role = useSession((state) => state.loggedUser?.rol);
  const canEdit = canEditProjects(role);
  const [showActive, setShowActive] = useState(false);
  const { loggedUser } = useSession();

  const isClient = loggedUser?.rol === RolesRecord.client;

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestionar Proyectos
        </h1>
        {!isClient && (
          <Button
            className="font-semibold rounded-full px-5"
            onClick={() => setShowActive(!showActive)}
          >
            {showActive ? (
              <>
                <LayoutList className="w-4 h-4 mr-1" />
                Ver todos los proyectos
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-1" />
                Ver proyectos ejecutados
              </>
            )}
          </Button>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl border flex flex-col flex-1">
        {isClient ? (
          <ClientProjectsTable dni={loggedUser?.dni_perfil ?? ""} />
        ) : showActive ? (
          <ActiveProjectsTable onVerTodos={() => setShowActive(false)} />
        ) : (
          <ListProjectsProvider>
            <ProjectsTable canEdit={canEdit} />
          </ListProjectsProvider>
        )}
      </div>
    </>
  );
}

export default ProjectsManagementPage;
