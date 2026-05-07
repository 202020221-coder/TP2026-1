import { createContext } from "react";
import type { GetProjectsQP } from "../interfaces/query-params.dto";
import type { GetProjectsResponse } from "../interfaces/responses.dto";
import type { UseQueryResult } from "@tanstack/react-query";

interface IListProjectsContext {
  result: UseQueryResult<GetProjectsResponse, Error>;
  query: (queryParams: GetProjectsQP) => void;
  queryParams: GetProjectsQP;
}

export const ListProjectsContext = createContext<IListProjectsContext | null>(
  null
);
