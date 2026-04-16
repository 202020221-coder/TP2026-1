import { useState, type FC, type ReactNode } from "react";
import { type GetOrdersQP } from "../interfaces/query-params.dto";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../api/order.api";
import { ListOrdersContext } from "./ListOrdersContext";

export const ListOrdersProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryParams, setQueryParams] = useState<GetOrdersQP>({
    page: 1,
    limit: 10,
  });
  const result = useQuery({
    queryKey: ["orders", queryParams],
    queryFn: () => getAllOrders(queryParams),
  });
  const query = (queryParams: GetOrdersQP) => {
    setQueryParams(queryParams);
  };
  //trayendo categorias
  return (
    <ListOrdersContext.Provider value={{ result, query, queryParams }}>
      {children}
    </ListOrdersContext.Provider>
  );
};
