import { createContext } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { GetQuotationQP } from "../interfaces/query-params.dto";
import type { GetQuotationsResponse } from "../interfaces/quotation-responses.dto";

interface IListQuotationContext {
  result: UseQueryResult<GetQuotationsResponse, Error>;
  query: (queryParams: GetQuotationQP) => void;
  queryParams: GetQuotationQP;
}

export const ListQuotationContext = createContext<IListQuotationContext | null>(
  null,
);
