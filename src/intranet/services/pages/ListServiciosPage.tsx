import { ListServiciosProvider } from "../context/ListServiciosProvider";
import { ServiciosTable } from "../components/ServiciosTable";

export function ListServiciosPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800">
        Gestionar Servicios
      </h1>
      <ListServiciosProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border flex flex-col flex-1">
          <ServiciosTable />
        </div>
      </ListServiciosProvider>
    </>
  );
}

export default ListServiciosPage;
