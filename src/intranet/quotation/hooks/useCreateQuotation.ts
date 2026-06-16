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
  orderId?: string;
  incidenciaId?: string;
  // Optional fields propagated from the source solicitud. These are only
  // present when creating a cotización from an approved solicitud.
  // Names match PostRequestDTO so the backend can reuse field handlers.
  solicitudExtras?: {
    productoenvio?: string;
    camionesenvio?: string;
    obsgenerales?: string;
    obseleccion?: string;
    medios?: { cliente_email: string; cliente_telefono: string }[];
    fechaCreacionSolicitud?: string;
  };
}

export const useCreateQuotation = ({
  referenceData,
  orderId,
  incidenciaId,
  solicitudExtras,
}: UseCreateQuotationOptions) => {
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const inventory = useQuotationProductStore((s) => s.items);
  const trucks = useQuotationTruckStore((s) => s.selectedTrucks);
  const quotationName = useQuotationReferenceStore((s) => s.name);
  const phases = useQuotationReferenceStore((s) => s.phases);
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
    setIsSending(true);
    toast.promise(
      async () => {
        await createQuotation({
          id_solicitud: orderId ? Number(orderId) : undefined,
          id_incidencia: incidenciaId ? Number(incidenciaId) : undefined,
          DNI_O_RUC: referenceData.DNIorRUC,
          name: quotationName || "cotización",
          inventory: Object.values(inventory),
          services: Object.values(servicios),
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
          },
          quotationRate: {
            sellingRate: rate?.sellingRate ?? 0,
            buyingRate: rate?.buyingRate ?? 0,
          },
          phases,
          // Forward optional solicitud-only fields if present.
          productoenvio: solicitudExtras?.productoenvio,
          camionesenvio: solicitudExtras?.camionesenvio,
          obsgenerales: solicitudExtras?.obsgenerales,
          obseleccion: solicitudExtras?.obseleccion,
          medios: solicitudExtras?.medios,
          fechaCreacionSolicitud: solicitudExtras?.fechaCreacionSolicitud,
        });
        navigate(incidenciaId ? "/intranet/incidencias" : "/intranet/solicitudes");
      },
      {
        loading: "Creando cotización...",
        success: "Cotización creada con éxito.",
        error: "Error al crear la cotización",
      },
    );
  }, [
    orderId,
    incidenciaId,
    referenceData,
    quotationName,
    phases,
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
    solicitudExtras,
  ]);

  return { isSending, handleSubmit };
};
