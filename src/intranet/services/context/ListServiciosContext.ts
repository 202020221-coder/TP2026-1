import { createContext, useContext } from "react";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import type { GetServiciosQP } from "../interfaces/query-params.dto";
import type { GetServiciosResponse } from "../interfaces/responses.dto";
import type { Servicio, CreateServicioDTO, UpdateServicioDTO } from "../interfaces/service";

interface ListServiciosContextValue {
  result: UseQueryResult<GetServiciosResponse>;
  queryParams: GetServiciosQP;
  query: (params: GetServiciosQP) => void;
  createMutation: UseMutationResult<Servicio, Error, CreateServicioDTO>;
  updateMutation: UseMutationResult<Servicio, Error, { id: number; dto: UpdateServicioDTO }>;
  toggleActivoMutation: UseMutationResult<Servicio, Error, number>;
  toggleActivoLocal: (id: number) => void;
}

export const ListServiciosContext = createContext<ListServiciosContextValue | null>(null);

export const useListServicios = () => {
  const ctx = useContext(ListServiciosContext);
  if (!ctx) throw new Error("useListServicios must be used within ListServiciosProvider");
  return ctx;
};
