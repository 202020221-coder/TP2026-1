import { ListServiciosProvider } from "../context/ListServiciosProvider";
import { ServiciosTable } from "../components/ServiciosTable";

export function ListServiciosPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestionar Servicios
        </h1>
      </div>
      <ListServiciosProvider>
        <div className="bg-card p-6 rounded-xl shadow-xs border flex flex-col flex-1 min-h-0">
          <ServiciosTable />
        </div>
      </ListServiciosProvider>
    </>
  );
}

export default ListServiciosPage;
