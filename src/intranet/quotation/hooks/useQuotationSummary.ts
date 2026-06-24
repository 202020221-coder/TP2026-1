import { useQuery } from "@tanstack/react-query";
import { getQuotationById } from "../api/quotation.api";

export const useQuotationSummary = (
  quotationId: number | null,
  enabled = true,
) =>
  useQuery({
    queryKey: ["quotation", "summary", quotationId],
    queryFn: () => getQuotationById(quotationId!),
    enabled: enabled && quotationId != null && quotationId > 0,
  });
