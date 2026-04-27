import { PDFViewer } from "@react-pdf/renderer";
import { PdfDocument } from "./PdfDocument";
// Importamos los stores
import { useTruck } from "@/intranet/quotation/hooks/stores/orderTruckStore";
import { useOrderPickup } from "@/intranet/quotation/hooks/stores/orderPickupStore";
import { useOrderConditions } from "@/intranet/quotation/hooks/stores/conditions.store";
import { useOrderInventoryStore } from "@/intranet/quotation/hooks/stores/orderInventoryStore";

export const PdfPreview = () => {
  // Obtenemos datos de cada store
  const inventory = useOrderInventoryStore((state) => state.items);
  const truck = useTruck((state) => state.selectedTruck);
  const pickupCost = useOrderPickup((state) => state.pickupCost);
  const pickupDate = useOrderPickup((state) => state.pickupDate);
  const emissionDate = useOrderConditions((state) => state.emissionDate);
  const expirationDate = useOrderConditions((state) => state.expirationDate);
  const conditions = useOrderConditions((state) => state.conditions);

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
