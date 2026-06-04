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
  /** Ítems de la página actual (ya filtrados por estado/búsqueda). */
  items: InventarioItem[];
  /** Total de ítems tras aplicar los filtros (no la página). */
  totalItems: number;
  /** Total de páginas calculado sobre los ítems filtrados. */
  totalPages: number;
}

export const ListInventarioContext =
  createContext<IListInventarioContext | null>(null);
