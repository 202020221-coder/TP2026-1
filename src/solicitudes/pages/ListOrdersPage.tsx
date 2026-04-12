import { ListOrdersProvider } from "../context/ListOrdersProvider";
import { OrdersTable } from "../components/OrdersTable";
import { Layout } from "@/shared/layout/Layout";

export function ListOrdersPage() {
  return (
    <Layout title="Mis Solicitudes">
      <h1 className="text-2xl font-semibold text-gray-800">
        Solicitudes
      </h1>
      <h3>
        Aquí puedes gestionar las solicitudes de los clientes
      </h3>
      <ListOrdersProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border">
          <OrdersTable />
        </div>
      </ListOrdersProvider>
    </Layout>
  );
};

export default ListOrdersPage;