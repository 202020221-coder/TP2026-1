
import { ProjectsTable } from "../components";
import { ListProjectsProvider } from "../context/ListProjectsProvider";

export function ProjectsManagementPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800">Gestionar Proyectos</h1>
      <ListProjectsProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border flex flex-col flex-1 min-h-0">
          <ProjectsTable />
        </div>
      </ListProjectsProvider>
    </>
  );
}
