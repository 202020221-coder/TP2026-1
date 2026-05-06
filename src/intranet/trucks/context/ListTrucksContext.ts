import { createContext } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Pagination } from "@/shared/interfaces/api-response";
import type { Truck } from "../interfaces/truck.interface";

export interface IListTrucksContext {
  result: UseQueryResult<Pagination<Truck[]>, Error>;
  search: string;
  setSearch: (value: string) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
  filteredCamiones: Truck[];
}

export const ListTrucksContext = createContext<IListTrucksContext | null>(null);
