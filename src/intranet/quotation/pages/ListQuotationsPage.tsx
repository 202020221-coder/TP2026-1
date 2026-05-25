import { QuotationTable } from "../components/list/QuotationTable";
import { ListQuotationsProvider } from "../context/ListQuotationProvider";

export function ListQuotationsPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Listado de Cotizaciones
        </h1>
      </div>
      <ListQuotationsProvider>
        <div className="bg-card p-6 rounded-xl shadow-xs border flex flex-col flex-1 min-h-0">
          <QuotationTable />
        </div>
      </ListQuotationsProvider>
    </>
  );
}
