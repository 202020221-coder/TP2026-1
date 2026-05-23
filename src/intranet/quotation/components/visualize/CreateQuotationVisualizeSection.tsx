import { Button } from "@/shared/components/ui/button";
import PdfPreview from "./PdfPreview";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { createQuotation } from "../../api/quotation.api";
import { useQuotationProductStore } from "../../hooks/stores/quotation.products.store.provider";
import { useQuotationTruckStore } from "../../hooks/stores/quotation.truck.store.provider";
import { useQuotationPickupStore } from "../../hooks/stores/quotation.pickup.store.provider";
import { useQuotationConditionStore } from "../../hooks/stores/quotation.conditions.store.provider";
import { useQuotationExchangeRate } from "../../hooks/stores/quotation.exchange.rate.store.provider";
import { useQuotationReferenceStore } from "../../hooks/stores/quotation.reference.store.provider";
import type { DetailedOrder } from "@/intranet/orders/interfaces/order";

export const CreateQuotationVisualizeSection = ({
  detailedOrder,
}: {
  detailedOrder: DetailedOrder;
}) => {
  const [isSending, setIsSending] = useState(false);
  const Navigate = useNavigate();
  const inventory = useQuotationProductStore((state) => state.items);
  const truck = useQuotationTruckStore((state) => state.selectedTruck);
  const quotationName = useQuotationReferenceStore((state) => state.name);
  const pickupCost = useQuotationPickupStore((state) => state.pickupCost);
  const pickupDate = useQuotationPickupStore((state) => state.pickupDate);
  const pickupAddress = useQuotationPickupStore((state) => state.pickupAddress);
  const emissionDate = useQuotationConditionStore(
    (state) => state.emissionDate,
  );
  const expirationDate = useQuotationConditionStore(
    (state) => state.expirationDate,
  );
  const conditions = useQuotationConditionStore((state) => state.conditions);
  const observaciones = useQuotationConditionStore((state) => state.observaciones);
  const rate = useQuotationExchangeRate((s) => s.rate);
  const handleSend = async () => {
    try {
      setIsSending(true);
      toast.promise(
        async () => {
          await createQuotation({
            id_solicitud: detailedOrder.ID,
            DNI_O_RUC: detailedOrder.Id_Cliente,
            nombre: quotationName || "cotizacion nombre",
            condiciones: {
              condiciones: conditions,
              fechaEmision: emissionDate,
              fechaVigencia: expirationDate,
              observaciones,
            },
            costoRecojo: {
              costo: pickupCost,
              direccionRecojo: pickupAddress,
              fechaRecojo: pickupDate,
            },
            id_camion: truck?.Placa ?? "",
            productos: Object.values(inventory),
            tasaCambio: {
              tasaCompra: rate?.buyingRate ?? 0.0,
              tasaVenta: rate?.sellingRate ?? 0.0,
            }, //obtener tasa siempre al entrar
          });
          Navigate("/intranet/solicitudes");
        }, // tu promesa real aquí
        {
          loading: "Loading...",
          success: "Cotización enviada con éxito.",
          error: "Error",
        },
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button
        className="w-full mb-2 h-14"
        disabled={isSending}
        onClick={handleSend}
      >
        <Send className="mr-2 h-4 w-4" />
        {isSending ? "Enviando..." : "Crear Cotización y enviar al cliente"}
      </Button>
      <PdfPreview key={Date.now()} />
    </>
  );
};
