import { useState, type FC, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import type { GetQuotationQP } from "../interfaces/query-params.dto";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllQuotations } from "../api/quotation.api";
import { ListQuotationContext } from "./ListQuotationContext";
import {
  QuotationStatesRecord,
  type QuotationState,
} from "../enum/quotation-state.record";

function parseEstadoFromUrl(value: string | null): QuotationState | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return Object.values(QuotationStatesRecord).includes(normalized as QuotationState)
    ? (normalized as QuotationState)
    : undefined;
}

export const ListQuotationsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchParams] = useSearchParams();
  const estadoFromUrl = parseEstadoFromUrl(searchParams.get("estado"));

  const [queryParams, setQueryParams] = useState<GetQuotationQP>({
    page: 1,
    per_page: 10,
    ...(estadoFromUrl ? { estado: estadoFromUrl } : {}),
  });

  const result = useQuery({
    queryKey: ["quotations", queryParams],
    queryFn: () => getAllQuotations(queryParams),
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    placeholderData: keepPreviousData,
  });

  const query = (queryParams: GetQuotationQP) => {
    setQueryParams(queryParams);
  };

  return (
    <ListQuotationContext.Provider value={{ result, query, queryParams }}>
      {children}
    </ListQuotationContext.Provider>
  );
};
