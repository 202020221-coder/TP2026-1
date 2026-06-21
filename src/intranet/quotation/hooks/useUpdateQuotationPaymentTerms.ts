import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { updateQuotationPaymentTerms } from "../api/quotation.api";
import type { QuotationPaymentInstallment } from "../interfaces/quotation-payment-terms";
import type { Quotation } from "../interfaces/quotation";

const parseUpdatePaymentTermsError = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return "No se pudieron actualizar los plazos de pago.";
  }

  const apiMessage =
    typeof error.response?.data === "object" &&
    error.response?.data &&
    "message" in error.response.data
      ? String((error.response.data as { message: string }).message)
      : undefined;

  if (apiMessage) {
    return apiMessage;
  }

  if (error.response?.status === 404) {
    return "Cotización no encontrada.";
  }

  return "No se pudieron actualizar los plazos de pago.";
};

export const useUpdateQuotationPaymentTerms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      plazos_pago,
    }: {
      quotationId: Quotation["ID"];
      plazos_pago: QuotationPaymentInstallment[];
    }) => updateQuotationPaymentTerms(quotationId, plazos_pago),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({
        queryKey: ["quotation", "payment-terms", variables.quotationId],
      });
      toast.success("Plazos de pago actualizados.");
    },
    onError: (error) => {
      toast.error(parseUpdatePaymentTermsError(error));
    },
  });
};
