import { ListTrucksProvider } from "../context/ListTrucksProvider";
import { TrucksTable } from "../components/TrucksTable";

export function ListTrucksPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Gestión de Camiones</h1>
      </div>
      <ListTrucksProvider>
        <div className="bg-card p-6 rounded-xl shadow-xs border flex flex-col flex-1 min-h-0">
          <TrucksTable />
        </div>
      </ListTrucksProvider>
    </>
  );
}

export default ListTrucksPage;
