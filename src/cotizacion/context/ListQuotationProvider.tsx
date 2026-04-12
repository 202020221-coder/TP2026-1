import { useState, type FC, type ReactNode } from "react";
import type { GetQuotationQP } from "../interfaces/query.params.dto";
import { useQuery } from "@tanstack/react-query";
import { getAllQuontation } from "../api/quotation.api";
import { ListQuotationContext } from "./ListQuotationContext";
// import { type GetOrdersQP } from "../interfaces/query-params.dto";
// import { useQuery } from "@tanstack/react-query";
// import { getAllOrders } from "../api/order.api";
// import { ListOrdersContext } from "./ListOrdersContext";

export const ListQuotationsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryParams, setQueryParams] = useState<GetQuotationQP>({
    page: 1,
  });
  const result = useQuery({
    queryKey: ["orders", queryParams],
    queryFn: () => getAllQuontation(),
  });
  const query = (queryParams: GetQuotationQP) => {
    setQueryParams(queryParams);
  };
  //trayendo categorias
  return (
    <ListQuotationContext.Provider
      value={{ result, query, queryParams }}
    >
      {children}
    </ListQuotationContext.Provider>
  );
};