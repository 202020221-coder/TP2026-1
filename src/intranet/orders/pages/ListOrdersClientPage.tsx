import { ListOrdersProvider } from "../context/ListOrdersProvider";
import { ClientOrdersTable } from "../components/client/ClientOrdersTable";
export function ListOrdersClientPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800">Mis Solicitudes</h1>
      <ListOrdersProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border">
          <ClientOrdersTable />
        </div>
      </ListOrdersProvider>
    </>
  );
}

export default ListOrdersClientPage;
