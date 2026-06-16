import { useState, type FC, type ReactNode } from "react";
import type { GetQuotationQP } from "../interfaces/query-params.dto";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllQuotations } from "../api/quotation.api";
import { ListQuotationContext } from "./ListQuotationContext";
export const ListQuotationsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryParams, setQueryParams] = useState<GetQuotationQP>({
    page: 1,
    per_page: 10,
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
