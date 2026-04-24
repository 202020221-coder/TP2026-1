import { useState, type FC, type ReactNode } from "react";
import type { GetQuotationQP } from "../interfaces/query-params.dto";
import { useQuery } from "@tanstack/react-query";
import { getAllQuotations } from "../api/quotation.api";
import { ListQuotationContext } from "./ListQuotationContext";

export const ListQuotationsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryParams, setQueryParams] = useState<GetQuotationQP>({
    page: 1,
  });
  const result = useQuery({
    queryKey: ["quotations", queryParams],
    queryFn: () => getAllQuotations({}),
  });
  const query = (queryParams: GetQuotationQP) => {
    setQueryParams(queryParams);
  };
  //trayendo categorias
  return (
    <ListQuotationContext.Provider value={{ result, query, queryParams }}>
      {children}
    </ListQuotationContext.Provider>
  );
};
