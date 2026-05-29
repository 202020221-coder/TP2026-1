import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { updateQuotation } from "../api/quotation.api";
import { useQuotationProductStore } from "./stores/quotation.products.store.provider";
import { useQuotationTruckStore } from "./stores/quotation.truck.store.provider";
import { useQuotationReferenceStore } from "./stores/quotation.reference.store.provider";
import { useQuotationPickupStore } from "./stores/quotation.pickup.store.provider";
import { useQuotationConditionStore } from "./stores/quotation.conditions.store.provider";
import { useQuotationServiceStore } from "./stores/quotation.services.store.provider";
import { useQuotationExchangeRate } from "./stores/quotation.exchange.rate.store.provider";

interface UseUpdateQuotationOptions {
  quotationId: string;
}

export const useUpdateQuotation = ({
  quotationId,
}: UseUpdateQuotationOptions) => {
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
    if (!quotationId) return;

    setIsSending(true);
    await toast.promise(
      async () => {
        await updateQuotation(Number(quotationId), {
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
        navigate("/intranet/cotizaciones");
      },
      {
        loading: "Actualizando cotización...",
        success: "Cotización actualizada con éxito.",
        error: "Error al actualizar la cotización",
      },
    );
  }, [
    quotationId,
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
