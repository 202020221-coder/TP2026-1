import { createContext } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Pagination } from "@/shared/interfaces/api-response";
import type { InventarioItem } from "../interfaces/inventory.interface";

export type InventarioStatusFilter = "available" | "unavailable";

export interface IListInventarioContext {
  result: UseQueryResult<Pagination<InventarioItem[]>, Error>;
  search: string;
  setSearch: (value: string) => void;
  statusFilter: InventarioStatusFilter;
  setStatusFilter: (value: InventarioStatusFilter) => void;
  page: number;
  setPage: (value: number) => void;
  limit: number;
  setLimit: (value: number) => void;
  filteredItems: InventarioItem[];
}

export const ListInventarioContext =
  createContext<IListInventarioContext | null>(null);
