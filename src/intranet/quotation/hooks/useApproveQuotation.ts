import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { approveQuotation } from "../api/quotation.api";

const parseApproveError = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return "No se pudo aprobar la orden de servicio.";
  }

  const status = error.response?.status;
  const apiMessage =
    typeof error.response?.data === "object" &&
    error.response?.data &&
    "message" in error.response.data
      ? String((error.response.data as { message: string }).message)
      : undefined;

  if (apiMessage) {
    return apiMessage;
  }

  if (status === 400) {
    return "No hay orden de compra o el estado no es pendiente.";
  }
  if (status === 409) {
    return "La cotización ya fue aprobada o ya existe un proyecto asociado.";
  }
  if (status === 404) {
    return "Cotización no encontrada.";
  }

  return "No se pudo aprobar la orden de servicio.";
};

export const useApproveQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quotationId: number) => approveQuotation(quotationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast.success(
        `${data.message} (Proyecto #${data.id_proyecto}, ${data.trabajos_creados} trabajos creados)`,
      );
    },
    onError: (error) => {
      toast.error(parseApproveError(error));
    },
  });
};
