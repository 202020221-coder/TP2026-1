import { PDFViewer } from "@react-pdf/renderer";
import { PdfDocument, type PDFQuotationDocumentProps } from "./PdfDocument";
// Importamos los stores
import { useQuotationProductStore } from "../../hooks/stores/quotation.products.store.provider";
import { useQuotationServiceStore } from "../../hooks/stores/quotation.services.store.provider";
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
  const services = useQuotationServiceStore((state) => state.items);
  const trucks = useQuotationTruckStore((state) => state.selectedTrucks);
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
  const observations = useQuotationConditionStore(
    (state) => state.observations,
  );

  // Construimos el objeto data
  const data: PDFQuotationDocumentProps["data"] = {
    client,
    inventory,
    services,
    trucks,
    pickup: {
      pickupCost,
      pickupDate,
      pickupAddress,
    },
    conditions: {
      emissionDate,
      expirationDate,
      conditions,
      observations,
    },
  };

  return (
    <PDFViewer width="100%" height="800">
      <PdfDocument data={data} />
    </PDFViewer>
  );
};

export default PdfPreview;
