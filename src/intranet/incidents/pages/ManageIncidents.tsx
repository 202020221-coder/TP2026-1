import { IncidentsTable } from "../components";
import { ListIncidentsProvider } from "../context/ListIncidentsProvider";

export function IncidentsManagementPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Gestionar Incidencias
        </h1>
      </div>
      <ListIncidentsProvider>
        <div className="bg-card p-6 rounded-xl shadow-xs border flex flex-col flex-1 min-h-0">
          <IncidentsTable />
        </div>
      </ListIncidentsProvider>
    </>
  );
}
