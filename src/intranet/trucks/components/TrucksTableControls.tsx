import type { FC, ReactNode } from "react";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { useTrucks } from "../hooks/useTrucks";
import { RegisterTruckDialog } from "./RegisterTruckDialog";

export const TrucksTableControls: FC<{ children: ReactNode }> = ({ children }) => {
  const { search, setSearch, fromDate, setFromDate, toDate, setToDate, result } =
    useTrucks();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-7 space-y-1">
          <p className="text-xs text-transparent select-none">Buscar</p>
          <div className="relative">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por placa o nombre"
              className="pl-8"
              disabled={result.isFetching}
            />
            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-2 md:col-span-5 md:justify-end">
          <div className="w-full max-w-[190px] space-y-1">
            <p className="text-xs text-muted-foreground">Desde</p>
            <Input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              disabled={result.isFetching}
            />
          </div>

          <div className="w-full max-w-[190px] space-y-1">
            <p className="text-xs text-muted-foreground">Hasta</p>
            <Input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              disabled={result.isFetching}
            />
          </div>

          <RegisterTruckDialog disabled={result.isFetching} />
        </div>
      </div>
      {children}
    </div>
  );
};
