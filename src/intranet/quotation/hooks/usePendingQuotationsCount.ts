import { useQuery } from "@tanstack/react-query";
import { getAllQuotations } from "../api/quotation.api";
import { QuotationStatesRecord } from "../enum/quotation-state.record";
import { useSession } from "@/security/session/hooks/stores/useSession.store";

/** Misma petición que el listado con filtro `estado=pendiente`; usa `pagination.total`. */
export const PENDING_QUOTATIONS_COUNT_PARAMS = {
  page: 1,
  per_page: 1,
  estado: QuotationStatesRecord.pending,
} as const;

export async function fetchPendingQuotationsCount(): Promise<number> {
  const response = await getAllQuotations(PENDING_QUOTATIONS_COUNT_PARAMS);
  return Math.max(response.pagination?.total ?? 0, response.data?.length ?? 0);
}

export function usePendingQuotationsCount() {
  const accessToken = useSession((s) => s.accessToken);

  return useQuery({
    queryKey: ["quotations", "pending-count", PENDING_QUOTATIONS_COUNT_PARAMS],
    queryFn: fetchPendingQuotationsCount,
    enabled: Boolean(accessToken),
    staleTime: 30_000,
  });
}
