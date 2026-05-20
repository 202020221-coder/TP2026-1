import { useState } from "react";
import { ProjectsTable } from "../components";
import { ListProjectsProvider } from "../context/ListProjectsProvider";
import { ActiveProjectsTable } from "../components/ActiveProjectsTable";
import { Button } from "@/shared/components/ui/button";
import { PlayCircle } from "lucide-react";

export function ProjectsManagementPage() {
  const [showActive, setShowActive] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Gestionar Proyectos</h1>
        {!showActive && (
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full px-5"
            onClick={() => setShowActive(true)}
          >
            <PlayCircle className="w-4 h-4 mr-1" />
            Ver proyectos ejecutados
          </Button>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl border flex flex-col flex-1">
        {showActive ? (
          <ActiveProjectsTable onVerTodos={() => setShowActive(false)} />
        ) : (
          <ListProjectsProvider>
            <ProjectsTable />
          </ListProjectsProvider>
        )}
      </div>
    </>
  );
}

export default ProjectsManagementPage;
