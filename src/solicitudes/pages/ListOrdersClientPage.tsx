import { ListOrdersProvider } from "../context/ListOrdersProvider";
import { ClientOrdersTable } from "../components/client/ClientOrdersTable";
import { Layout } from "@/shared/layout/Layout";

export function ListOrdersClientPage() {
  return (
    <Layout title="Mis Solicitudes">
      <h1 className="text-2xl font-semibold text-gray-800">
        Mis Solicitudes
      </h1>
      <ListOrdersProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border">
          <ClientOrdersTable />
        </div>
      </ListOrdersProvider>
    </Layout>
  );
};

export default ListOrdersClientPage;