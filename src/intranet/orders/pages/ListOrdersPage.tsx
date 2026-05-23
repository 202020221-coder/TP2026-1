import { ListOrdersProvider } from "../context/ListOrdersProvider";
import { OrdersTable } from "../components/OrdersTable";
export function ListOrdersPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Listado de Solicitudes
        </h1>
      </div>
      <ListOrdersProvider>
        <div className="bg-card p-6 rounded-xl shadow-xs border flex flex-col flex-1 min-h-0">
          <OrdersTable />
        </div>
      </ListOrdersProvider>
    </>
  );
}

export default ListOrdersPage;
