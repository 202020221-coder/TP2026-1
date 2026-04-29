import { createContext } from "react";
import type { UseQueryResult } from "@tanstack/react-query";

import type { GetRequestQP, ResponseRequestDTO } from "../interfaces";

interface IListRequestContext {
  result: UseQueryResult<ResponseRequestDTO, Error>;
  query: (queryParams: GetRequestQP) => void;
  queryParams: GetRequestQP;
}

export const ListRequestContext = createContext<IListRequestContext | null>(
  null,
);
