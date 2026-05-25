import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getQuotationForAdmin } from "../api/quotation.api";

export const useViewQuotationPage = () => {
  const { quotationId } = useParams<{ quotationId: string }>();
  const enabled = !!quotationId;

  const query = useQuery({
    queryKey: ["quotation", "admin", quotationId],
    queryFn: () => getQuotationForAdmin(Number(quotationId)),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled,
  });

  return {
    quotationId,
    data: query.data ?? null,
    isPending: query.isPending,
    isError: query.isError,
  };
};
