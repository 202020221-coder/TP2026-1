import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { approveQuotationInternally } from "../api/quotation.api";

const parseApproveInternallyError = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return "No se pudo aprobar la cotización.";
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

  const status = error.response?.status;
  if (status === 403) {
    return "No tienes permiso para aprobar esta cotización.";
  }
  if (status === 409) {
    return "Esta cotización ya fue aprobada por tu rol.";
  }

  return "No se pudo aprobar la cotización.";
};

export const useApproveQuotationInternally = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quotationId: number) => approveQuotationInternally(quotationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(parseApproveInternallyError(error));
    },
  });
};
