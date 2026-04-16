import { Layout } from "@/shared/layout/Layout";
import { QuotationTable } from "../components/QuotationTable";
import { ListQuotationsProvider } from "../context/ListQuotationProvider";

export function ListQuotationPage() {
  return (
    <Layout title="Gestionar Cotizaciones">
      <h1 className="text-2xl font-semibold text-gray-800">
        Listado de Cotizaciones
      </h1>
      <ListQuotationsProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border">
          <QuotationTable />
        </div>
      </ListQuotationsProvider>
    </Layout>
  );
}