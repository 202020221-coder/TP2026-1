import { createContext } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { GetRequestsQP, GetRequestsResponse } from "../interfaces";

interface IListRequestContext {
  result: UseQueryResult<GetRequestsResponse, Error>;
  query: (queryParams: GetRequestsQP) => void;
  queryParams: GetRequestsQP;
}

export const ListRequestContext = createContext<IListRequestContext | null>(
  null,
);

export default ListRequestContext;
