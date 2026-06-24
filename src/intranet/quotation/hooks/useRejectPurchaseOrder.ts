import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { rejectPurchaseOrder } from "../api/purchase_order.api";

const parseRejectError = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return "No se pudo rechazar la orden de compra.";
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
    return "El endpoint de rechazo no está disponible en el servidor.";
  }

  return "No se pudo rechazar la orden de compra.";
};

export const useRejectPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      motivo,
    }: {
      quotationId: number;
      motivo: string;
    }) => rejectPurchaseOrder(quotationId, motivo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({
        queryKey: ["quotation", "orden-compra-check", data.ID],
      });
      queryClient.invalidateQueries({
        queryKey: ["quotation", "summary", data.ID],
      });
      queryClient.invalidateQueries({ queryKey: ["incident-quotations"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(parseRejectError(error));
    },
  });
};
