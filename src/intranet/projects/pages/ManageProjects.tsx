import { ProjectsTable } from "../components";
import { ListProjectsProvider } from "../context/ListProjectsProvider";

export function ProjectsManagementPage() {
  return (
    <>
      <h1>Esta es la pagina para manejar proyectos</h1>
      <ListProjectsProvider>
        <ProjectsTable />
      </ListProjectsProvider>
    </>
  );
}
