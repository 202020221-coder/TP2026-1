import { PDFViewer } from "@react-pdf/renderer";
import { PdfDocument } from "./PdfDocument";
// Importamos los stores
import { useTruck } from "@/cotizacion/hooks/stores/orderTruckStore";
import { useOrderPickup } from "@/cotizacion/hooks/stores/orderPickupStore";
import { useOrderConditions } from "@/cotizacion/hooks/stores/orderConditions.store";
import { useOrderInventoryStore } from "@/cotizacion/hooks/stores/orderInventoryStore";

export const PdfPreview = () => {
  // Obtenemos datos de cada store
  const inventory = useOrderInventoryStore((state) => state.items);
  const truck = useTruck((state) => state.selectedTruck);
  const pilot = useTruck((state) => state.selectedTruckDriver);
  const pickupCost = useOrderPickup((state) => state.pickupCost);
  const pickupDate = useOrderPickup((state) => state.pickupDate);
  const emissionDate = useOrderConditions((state) => state.emissionDate);
  const expirationDate = useOrderConditions((state) => state.expirationDate);
  const conditions = useOrderConditions((state) => state.conditions);

  if (!pilot || !truck) {
    throw new Error("TRUCK Y PILOT NO DEFINIDOS");
  }

  console.log(pilot);
  console.log(truck);
  
  

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
    pilot,
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
