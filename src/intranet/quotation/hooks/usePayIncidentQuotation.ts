import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { payIncidentQuotation } from "../api/quotation.api";

const parsePayIncidentError = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return "No se pudo marcar la cotización como pagada.";
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

  if (error.response?.status === 409) {
    return "La cotización ya está marcada como Incidencia Pagada.";
  }

  return "No se pudo marcar la cotización como pagada.";
};

export const usePayIncidentQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quotationId: number) => payIncidentQuotation(quotationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({
        queryKey: ["quotation", "payment-terms", data.ID],
      });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(parsePayIncidentError(error));
    },
  });
};
