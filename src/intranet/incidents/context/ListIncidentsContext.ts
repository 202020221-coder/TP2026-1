import { createContext } from "react";
import type { GetIncidentsQP } from "../interfaces/query-params.dto";
import type { GetIncidentsResponse } from "../interfaces/responses.dto";
import type { UseQueryResult } from "@tanstack/react-query";

interface IListIncidentsContext {
  result: UseQueryResult<GetIncidentsResponse, Error>;
  query: (queryParams: GetIncidentsQP) => void;
  queryParams: GetIncidentsQP;
}

export const ListIncidentsContext = createContext<IListIncidentsContext | null>(
  null
);
