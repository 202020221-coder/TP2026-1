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
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";

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
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);
  const pickupDate = useQuotationPickupStore((s) => s.pickupDate);
  const pickupAddress = useQuotationPickupStore((s) => s.pickupAddress);
  const emissionDate = useQuotationConditionStore((s) => s.emissionDate);
  const expirationDate = useQuotationConditionStore((s) => s.expirationDate);
  const conditions = useQuotationConditionStore((s) => s.conditions);
  const observations = useQuotationConditionStore((s) => s.observations);
  const servicios = useQuotationServiceStore((s) => s.items);
  const rate = useQuotationExchangeRate((s) => s.rate);

  const handleSubmit = useCallback(async () => {
    if (!orderId) return;

    setIsSending(true);
    await toast.promise(
      async () => {
        await createQuotation({
          id_solicitud: Number(orderId),
          DNI_O_RUC: referenceData.DNIorRUC,
          nombre: quotationName || "cotización",
          condiciones: {
            condiciones: conditions,
            fechaEmision: emissionDate,
            fechaVigencia: expirationDate,
            observaciones: observations,
          },
          costoRecojo: {
            costo: pickupCost,
            direccionRecojo: pickupAddress,
            fechaRecojo: pickupDate,
          },
          id_camion: trucks[0]?.plate ?? "",
          productos: Object.values(inventory).map(
            ({ nombre: _nombre, ...rest }) => rest,
          ),
          servicios: Object.values(servicios),
          tasaCambio: {
            tasaCompra: rate?.buyingRate ?? 0,
            tasaVenta: rate?.sellingRate ?? 0,
          },
        });
        navigate("/intranet/solicitudes");
      },
      {
        loading: "Creando cotización...",
        success: "Cotización creada con éxito.",
        error: "Error al crear la cotización",
      },
    );
  }, [
    orderId,
    referenceData,
    quotationName,
    conditions,
    emissionDate,
    expirationDate,
    observations,
    pickupCost,
    pickupAddress,
    pickupDate,
    trucks,
    inventory,
    servicios,
    rate,
    navigate,
  ]);

  return { isSending, handleSubmit };
};
