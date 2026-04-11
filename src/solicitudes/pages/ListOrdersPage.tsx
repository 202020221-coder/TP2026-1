import { ListOrdersProvider } from "../context/ListOrdersProvider";
import { OrdersTable } from "../components/OrdersTable";

export function ListOrdersPage () {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Listado de Cotizaciones
      </h1>
      <ListOrdersProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border">
          <OrdersTable />
        </div>
      </ListOrdersProvider>
    </div>
  );
};

export default ListOrdersPage;