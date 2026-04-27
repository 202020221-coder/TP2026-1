import { createContext } from "react";
import type { GetServiciosQP } from "../interfaces/query-params.dto";
import type { GetServiciosResponse } from "../interfaces/responses.dto";
import type { UseQueryResult } from "@tanstack/react-query";

interface IListServiciosContext {
  result: UseQueryResult<GetServiciosResponse, Error>;
  query: (queryParams: GetServiciosQP) => void;
  queryParams: GetServiciosQP;
}

export const ListServiciosContext =
  createContext<IListServiciosContext | null>(null);
