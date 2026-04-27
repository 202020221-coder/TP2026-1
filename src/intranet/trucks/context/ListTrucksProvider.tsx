import { useMemo, useState, type FC, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { trucksBaseApi } from "../api/trucks.base.api";
import { ListTrucksContext } from "./ListTrucksContext";
import type { Truck } from "../interfaces/truck.interface";

const toDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const ListTrucksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");

  const result = useQuery({
    queryKey: ["trucks", "list"],
    queryFn: () => trucksBaseApi.getAll(),
  });

  const filteredCamiones = useMemo(() => {
    if (!result.data) {
      return [];
    }

    const searchTerm = search.trim().toLowerCase();
    const from = fromDate ? toDate(`${fromDate}T00:00:00`) : null;
    const to = toDateFilter ? toDate(`${toDateFilter}T23:59:59`) : null;

    return result.data.data.filter((camion: Truck) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        camion.Placa.toLowerCase().includes(searchTerm) ||
        camion.nombre.toLowerCase().includes(searchTerm);

      if (!matchesSearch) {
        return false;
      }

      if (!from && !to) {
        return true;
      }

      const revisionDate = toDate(camion.fecha_prox_revision);
      if (!revisionDate) {
        return false;
      }

      if (from && revisionDate < from) {
        return false;
      }

      if (to && revisionDate > to) {
        return false;
      }

      return true;
    });
  }, [result.data, search, fromDate, toDateFilter]);

  return (
    <ListTrucksContext.Provider
      value={{
        result,
        search,
        setSearch,
        fromDate,
        setFromDate,
        toDate: toDateFilter,
        setToDate: setToDateFilter,
        filteredCamiones,
      }}
    >
      {children}
    </ListTrucksContext.Provider>
  );
};
