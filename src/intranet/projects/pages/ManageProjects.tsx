
import { ProjectsTable } from "../components";
import { ListProjectsProvider } from "../context/ListProjectsProvider";

export function ProjectsManagementPage() {
  return (
    <>
      
        <h1 className="text-2xl font-bold text-gray-800">Gestionar Proyectos</h1>
  
      <ListProjectsProvider>
        <ProjectsTable />
      </ListProjectsProvider>
    </>
  );
}
