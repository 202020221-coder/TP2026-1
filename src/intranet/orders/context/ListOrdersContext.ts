import { createContext } from "react";
import type {
  GetOrdersQP,
} from "../interfaces/query-params.dto";
import type {
  GetOrdersResponse,
} from "../interfaces/responses.dto";
import type { UseQueryResult } from "@tanstack/react-query";

interface IListOrdersContext {
  result: UseQueryResult<GetOrdersResponse, Error>;
  query: (queryParams: GetOrdersQP) => void;
  queryParams: GetOrdersQP;
}

export const ListOrdersContext = createContext<IListOrdersContext | null>(
  null,
);
