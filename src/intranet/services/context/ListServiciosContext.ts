import { createContext, useContext } from "react";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import type { GetServiciosResponse } from "../interfaces/responses.dto";
import type { Servicio, CreateServicioDTO, UpdateServicioDTO } from "../interfaces/service";
import type { ServicioFilters } from "../interfaces/service-filters";

interface ListServiciosContextValue {
  result: UseQueryResult<GetServiciosResponse>;

  /** Servicios activos de la página actual, ya filtrados (para la tabla). */
  servicios: Servicio[];
  /** Todos los servicios desactivados (para el modal de Eliminados). */
  serviciosDesactivados: Servicio[];

  // ── Búsqueda (server-side) ──────────────────────────────────────────────
  search: string | undefined;
  setSearch: (value: string | undefined) => void;

  // ── Filtros de columna (client-side) ────────────────────────────────────
  filters: ServicioFilters;
  updateFilter: <K extends keyof ServicioFilters>(
    key: K,
    value: ServicioFilters[K],
  ) => void;
  resetFilters: () => void;
  activeFilterCount: number;
  filterOpen: boolean;
  setFilterOpen: (value: boolean) => void;

  // ── Paginación (client-side, solo sobre activos) ────────────────────────
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;

  // ── Mutaciones ──────────────────────────────────────────────────────────
  createMutation: UseMutationResult<Servicio, Error, CreateServicioDTO>;
  updateMutation: UseMutationResult<Servicio, Error, { id: number; dto: UpdateServicioDTO }>;
  toggleActivoMutation: UseMutationResult<Servicio, Error, { id: number; currentActivo: boolean }>;
  toggleActivoLocal: (id: number, currentActivo: boolean) => void;
}

export const ListServiciosContext = createContext<ListServiciosContextValue | null>(null);

export const useListServicios = () => {
  const ctx = useContext(ListServiciosContext);
  if (!ctx) throw new Error("useListServicios must be used within ListServiciosProvider");
  return ctx;
};
