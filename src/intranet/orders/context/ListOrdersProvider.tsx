import { useState, type FC, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { type GetOrdersQP } from "../interfaces/query-params.dto";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../api/order.api";
import { ListOrdersContext } from "./ListOrdersContext";
import {
  OrderStatesRecord,
  type OrderState,
} from "../enum/order-state.record";

function parseEstadoFromUrl(value: string | null): OrderState | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return Object.values(OrderStatesRecord).includes(normalized as OrderState)
    ? (normalized as OrderState)
    : undefined;
}

export const ListOrdersProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchParams] = useSearchParams();
  const estadoFromUrl = parseEstadoFromUrl(searchParams.get("estado"));

  const [queryParams, setQueryParams] = useState<GetOrdersQP>({
    page: 1,
    limit: 10,
    ...(estadoFromUrl ? { estado: estadoFromUrl } : {}),
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
