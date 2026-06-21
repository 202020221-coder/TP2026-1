import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { updateQuotation } from "../api/quotation.api";
import { useQuotationProductStore } from "./stores/quotation.products.store.provider";
import { useQuotationTruckStore } from "./stores/quotation.truck.store.provider";
import { useQuotationReferenceStore } from "./stores/quotation.reference.store.provider";
import { useQuotationPickupStore } from "./stores/quotation.pickup.store.provider";
import { useQuotationConditionStore } from "./stores/quotation.conditions.store.provider";
import { useQuotationServiceStore } from "./stores/quotation.services.store.provider";
import { useQuotationExchangeRate } from "./stores/quotation.exchange.rate.store.provider";
import { computeServiceDates } from "../lib/quotationSchedule";
import { useIncidentQuotationMode } from "../context/IncidentQuotationModeContext";

interface UseUpdateQuotationOptions {
  quotationId: string;
  incidentQuotationId?: number | null;
}

export const useUpdateQuotation = ({
  quotationId,
  incidentQuotationId = null,
}: UseUpdateQuotationOptions) => {
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  const inventory = useQuotationProductStore((s) => s.items);
  const trucks = useQuotationTruckStore((s) => s.selectedTrucks);
  const quotationName = useQuotationReferenceStore((s) => s.name);
  const phases = useQuotationReferenceStore((s) => s.phases);
  const projectStartDate = useQuotationReferenceStore(
    (s) => s.projectStartDate,
  );
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);
  const pickupDate = useQuotationPickupStore((s) => s.pickupDate);
  const pickupAddress = useQuotationPickupStore((s) => s.pickupAddress);
  const emissionDate = useQuotationConditionStore((s) => s.emissionDate);
  const expirationDate = useQuotationConditionStore((s) => s.expirationDate);
  const conditions = useQuotationConditionStore((s) => s.conditions);
  const observations = useQuotationConditionStore((s) => s.observations);
  const plazosPago = useQuotationConditionStore((s) => s.plazosPago);
  const servicios = useQuotationServiceStore((s) => s.items);
  const rate = useQuotationExchangeRate((s) => s.rate);
  const isIncidentQuotation = useIncidentQuotationMode();
  const isIncidentQuote = isIncidentQuotation || Boolean(incidentQuotationId);

  const handleSubmit = useCallback(async () => {
    if (!quotationId) return;

    setIsSending(true);
    try {
      await toast.promise(
        async () => {
          const servicesPayload = Object.values(servicios).map((service) => {
            const { startDate, dueDate } = computeServiceDates(
              service,
              projectStartDate,
              phases,
            );
            return {
              ...service,
              startDate,
              dueDate,
              isPrincipal: isIncidentQuote ? false : service.isPrincipal,
            };
          });

          await updateQuotation(Number(quotationId), {
            name: quotationName,
            projectStartDate,
            inventory: Object.values(inventory),
            services: servicesPayload,
            trucks,
            pickupService: {
              pickupCost,
              pickupDate,
              pickupAddress,
            },
            quotationConditions: {
              emissionDate,
              expirationDate,
              conditions,
              observations,
              plazosPago,
            },
            quotationRate: {
              sellingRate: rate?.sellingRate ?? 0,
              buyingRate: rate?.buyingRate ?? 0,
            },
            phases,
          });
          if (returnTo) {
            navigate(returnTo);
          } else if (isIncidentQuote && incidentQuotationId) {
            navigate(`/intranet/incidencias/${incidentQuotationId}`);
          } else {
            navigate("/intranet/cotizaciones");
          }
        },
        {
          loading: "Actualizando cotización...",
          success: "Cotización actualizada con éxito.",
          error: (err) => {
            console.error("[updateQuotation] error:", err);
            if (isAxiosError(err)) {
              console.error(
                "[updateQuotation] status:",
                err.response?.status,
                "data:",
                err.response?.data,
              );
              const apiMessage =
                (err.response?.data as { message?: string; error?: string })
                  ?.message ??
                (err.response?.data as { message?: string; error?: string })
                  ?.error;
              if (err.code === "ECONNABORTED") {
                return "La actualización tardó demasiado (timeout). Intenta nuevamente.";
              }
              if (apiMessage) {
                return `Error al actualizar la cotización: ${apiMessage}`;
              }
              if (err.response?.status) {
                return `Error al actualizar la cotización (HTTP ${err.response.status}).`;
              }
            }
            return "Error al actualizar la cotización";
          },
        },
      );
    } finally {
      setIsSending(false);
    }
  }, [
    quotationId,
    quotationName,
    phases,
    projectStartDate,
    inventory,
    servicios,
    trucks,
    pickupCost,
    pickupDate,
    pickupAddress,
    emissionDate,
    expirationDate,
    conditions,
    observations,
    rate,
    navigate,
    isIncidentQuote,
    incidentQuotationId,
    returnTo,
  ]);

  return { isSending, handleSubmit };
};
