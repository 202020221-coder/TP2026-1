import { PDFViewer } from "@react-pdf/renderer";
import { PdfDocument } from "./PdfDocument";
// Importamos los stores
import { useQuotationProductStore } from "../../hooks/stores/quotation.products.store.provider";
import { useQuotationTruckStore } from "../../hooks/stores/quotation.truck.store.provider";
import { useQuotationPickupStore } from "../../hooks/stores/quotation.pickup.store.provider";
import { useQuotationConditionStore } from "../../hooks/stores/quotation.conditions.store.provider";

interface PdfPreviewProps {
  client: {
    RUC: string;
    nombre_comercial: string;
    razon_social: string;
  };
}

export const PdfPreview = ({ client }: PdfPreviewProps) => {
  // Obtenemos datos de cada store
  const inventory = useQuotationProductStore((state) => state.items);
  const truck = useQuotationTruckStore((state) => state.selectedTruck);
  const pickupCost = useQuotationPickupStore((state) => state.pickupCost);
  const pickupDate = useQuotationPickupStore((state) => state.pickupDate);
  const emissionDate = useQuotationConditionStore((state) => state.emissionDate);
  const expirationDate = useQuotationConditionStore((state) => state.expirationDate);
  const conditions = useQuotationConditionStore((state) => state.conditions);
  const observaciones = useQuotationConditionStore((state) => state.observaciones);

  if (!truck) {
    throw new Error("TRUCK NO DEFINIDO");
  }

  // Construimos el objeto data
  const data = {
    client,
    inventory,
    truck,
    pickup: {
      pickupCost,
      pickupDate,
    },
    conditions: {
      emissionDate,
      expirationDate,
      conditions,
      observaciones,
    },
  };

  return (
    <PDFViewer width="100%" height="800">
      <PdfDocument data={data} />
    </PDFViewer>
  );
};

export default PdfPreview;
