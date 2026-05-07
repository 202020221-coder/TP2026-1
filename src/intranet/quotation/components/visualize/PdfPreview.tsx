import { PDFViewer } from "@react-pdf/renderer";
import { PdfDocument } from "./PdfDocument";
// Importamos los stores
import { useQuotationProductStore } from "../../hooks/stores/quotation.products.store.provider";
import { useQuotationTruckStore } from "../../hooks/stores/quotation.truck.store.provider";
import { useQuotationPickupStore } from "../../hooks/stores/quotation.pickup.store.provider";
import { useQuotationConditionStore } from "../../hooks/stores/quotation.conditions.store.provider";

export const PdfPreview = () => {
  // Obtenemos datos de cada store
  const inventory = useQuotationProductStore((state) => state.items);
  const truck = useQuotationTruckStore((state) => state.selectedTruck);
  const pickupCost = useQuotationPickupStore((state) => state.pickupCost);
  const pickupDate = useQuotationPickupStore((state) => state.pickupDate);
  const emissionDate = useQuotationConditionStore((state) => state.emissionDate);
  const expirationDate = useQuotationConditionStore((state) => state.expirationDate);
  const conditions = useQuotationConditionStore((state) => state.conditions);

  if (!truck) {
    throw new Error("TRUCK NO DEFINIDO");
  } 

  // Datos del cliente (pueden venir de otro store o props)
  const client = {
    RUC: "20501234567",
    nombre_comercial: "Mall Aventura Plaza",
    razon_social: "Aventura Plaza S.A.",
  };

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
    },
  };

  return (
    <PDFViewer width="100%" height="800">
      <PdfDocument data={data} />
    </PDFViewer>
  );
};

export default PdfPreview;
