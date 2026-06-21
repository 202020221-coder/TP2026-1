import { useQuery } from "@tanstack/react-query";
import { getQuotationPaymentTerms } from "../api/quotation.api";
import type { Quotation } from "../interfaces/quotation";

export const useQuotationPaymentTerms = (
  quotationId: Quotation["ID"],
  options?: { enabled?: boolean },
) => {
  const query = useQuery({
    queryKey: ["quotation", "payment-terms", quotationId],
    queryFn: () => getQuotationPaymentTerms(quotationId),
    enabled: quotationId > 0 && (options?.enabled ?? true),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return {
    terms: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
