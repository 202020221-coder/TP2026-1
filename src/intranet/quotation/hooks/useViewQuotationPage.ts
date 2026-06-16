import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getQuotationForAdmin } from "../api/quotation.api";
import { enrichQuotationAdminDetail } from "../lib/adaptQuotationFromApi";

export const useViewQuotationPage = () => {
  const { quotationId } = useParams<{ quotationId: string }>();
  const enabled = !!quotationId;

  const query = useQuery({
    queryKey: ["quotation", "admin", quotationId],
    queryFn: async () => {
      try {
        const dto = await getQuotationForAdmin(Number(quotationId));
        return enrichQuotationAdminDetail(dto);
      } catch (error) {
        console.log(error);
        throw new Error("ERROR CURRIOs");
      }
    },
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
