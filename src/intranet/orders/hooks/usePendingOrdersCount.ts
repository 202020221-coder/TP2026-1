import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../api/order.api";
import { OrderStatesRecord } from "../enum/order-state.record";
import { useSession } from "@/security/session/hooks/stores/useSession.store";

/** Misma petición que el listado con filtro "pendiente"; usa `pagination.total`. */
export const PENDING_ORDERS_COUNT_PARAMS = {
  page: 1,
  limit: 1,
  estado: OrderStatesRecord.pending,
} as const;

export async function fetchPendingOrdersCount(): Promise<number> {
  const response = await getAllOrders(PENDING_ORDERS_COUNT_PARAMS);
  return Math.max(response.pagination?.total ?? 0, response.data?.length ?? 0);
}

export function usePendingOrdersCount() {
  const accessToken = useSession((s) => s.accessToken);

  return useQuery({
    queryKey: ["orders", "pending-count", PENDING_ORDERS_COUNT_PARAMS],
    queryFn: fetchPendingOrdersCount,
    enabled: Boolean(accessToken),
    staleTime: 30_000,
  });
}
