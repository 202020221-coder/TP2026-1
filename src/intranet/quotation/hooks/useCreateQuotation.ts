import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { createQuotation } from "../api/quotation.api";
import { useQuotationProductStore } from "./stores/quotation.products.store.provider";
import { useQuotationTruckStore } from "./stores/quotation.truck.store.provider";
import { useQuotationReferenceStore } from "./stores/quotation.reference.store.provider";
import { useQuotationPickupStore } from "./stores/quotation.pickup.store.provider";
import { useQuotationConditionStore } from "./stores/quotation.conditions.store.provider";
import { useQuotationServiceStore } from "./stores/quotation.services.store.provider";
import { useQuotationExchangeRate } from "./stores/quotation.exchange.rate.store.provider";
import { computeServiceDates } from "../lib/quotationSchedule";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";
import { EMPTY_EXCHANGE_RATE } from "../api/exchange-rate.api";

interface UseCreateQuotationOptions {
  referenceData: DesiredQuotationData["client"];
  orderId: string;
}

export const useCreateQuotation = ({
  referenceData,
  orderId,
}: UseCreateQuotationOptions) => {
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

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
  const plazosPago = useQuotationConditionStore((s) => s.plazosPago);

  const observations = useQuotationConditionStore((s) => s.observations);
  const servicios = useQuotationServiceStore((s) => s.items);
  const rate = useQuotationExchangeRate((s) => s.rate);

  const handleSubmit = useCallback(async () => {
    if (!orderId) return;

    setIsSending(true);
    try {
      await toast.promise(
        async () => {
          // Recalcula las fechas de cada servicio según el día de inicio y la
          // etapa, para enviar fecha_inicio/fecha_finalizacion coherentes.
          const servicesPayload = Object.values(servicios).map((service) => {
            const { startDate, dueDate } = computeServiceDates(
              service,
              projectStartDate,
              phases,
            );
            return { ...service, startDate, dueDate };
          });

          await createQuotation({
            id_solicitud: Number(orderId),
            DNI_O_RUC: referenceData.DNIorRUC,
            name: quotationName || "cotización",
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
              sellingRate: rate?.sellingRate ?? EMPTY_EXCHANGE_RATE.sellingRate,
              buyingRate: rate?.buyingRate ?? EMPTY_EXCHANGE_RATE.buyingRate,
            },
            phases,
          });
          navigate("/intranet/solicitudes");
        },
        {
          loading: "Creando cotización...",
          success: "Cotización creada con éxito.",
          error: "Error al crear la cotización",
        },
      );
    } finally {
      setIsSending(false);
    }
  }, [
    orderId,
    referenceData,
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
  ]);

  return { isSending, handleSubmit };
};
