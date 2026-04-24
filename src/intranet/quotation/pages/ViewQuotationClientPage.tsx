import { ListQuotationsProvider } from "../context/ListQuotationProvider";
import { QuotationTable } from "../components/list/QuotationTable";

export function ViewQuotationPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800">Mis Cotizaciones</h1>
      <ListQuotationsProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border">
          <QuotationTable />
        </div>
      </ListQuotationsProvider>
    </>
  );
}
export default ViewQuotationPage;
