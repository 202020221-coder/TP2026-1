import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ProjectsTable } from "../components";
import { ListProjectsProvider } from "../context/ListProjectsProvider";

export function ProjectsManagementPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Gestionar Proyectos</h1>
        <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full px-5">
          <Plus className="w-4 h-4 mr-1" />
          Agregar Proyecto
        </Button>
      </div>
      <ListProjectsProvider>
        <ProjectsTable />
      </ListProjectsProvider>
    </>
  );
}
