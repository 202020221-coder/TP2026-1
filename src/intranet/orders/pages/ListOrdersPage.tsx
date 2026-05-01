import { ListOrdersProvider } from "../context/ListOrdersProvider";
import { OrdersTable } from "../components/OrdersTable";
export function ListOrdersPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Listado de Solicitudes
      </h1>
      <ListOrdersProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border flex flex-col flex-1">
          <OrdersTable />
        </div>
      </ListOrdersProvider>
    </>
  );
}

export default ListOrdersPage;
