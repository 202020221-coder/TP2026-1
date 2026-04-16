import { ListOrdersProvider } from "../context/ListOrdersProvider";
import { OrdersTable } from "../components/OrdersTable";
import { Layout } from "@/shared/layout/Layout";

export function ListOrdersPage() {
  return (
    <Layout title="Gestionar Solicitudes">
      <h1 className="text-2xl font-semibold text-gray-800">
        Listado de Solicitudes
      </h1>
      <ListOrdersProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border">
          <OrdersTable />
        </div>
      </ListOrdersProvider>
    </Layout>
  );
};

export default ListOrdersPage;