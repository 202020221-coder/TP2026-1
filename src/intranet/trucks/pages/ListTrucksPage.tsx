import { ListTrucksProvider } from "../context/ListTrucksProvider";
import { TrucksTable } from "../components/TrucksTable";

export function ListTrucksPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800">Gestión de Camiones</h1>
      <ListTrucksProvider>
        <div className="bg-white p-6 rounded-xl shadow-none border flex flex-col flex-1">
          <TrucksTable />
        </div>
      </ListTrucksProvider>
    </>
  );
}

export default ListTrucksPage;
