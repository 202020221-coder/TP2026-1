import { Layout } from "@/shared/layout/Layout";
import { ListQuotationsProvider } from "../context/ListQuotationProvider";
import { QuotationTable } from "../components/QuotationTable";

export function ViewQuotationPage() {
  return (
    // <QuotationProviderV2>
    <Layout title="Gestionar Cotizaciones">
      <h1 className="text-2xl font-semibold text-gray-800">
        Mis Cotizaciones
      </h1>
      <ListQuotationsProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border">
          <QuotationTable />
        </div>
      </ListQuotationsProvider>
    </Layout>
  );
};
export default ViewQuotationPage;
