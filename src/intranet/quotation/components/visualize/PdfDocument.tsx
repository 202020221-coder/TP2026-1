import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import Header from "./pdf/Header";
// import ClientInfo from "./components/ClientInfo";
import InventoryTable from "./pdf/InventoryTable";
import CostSummary from "./pdf/CostSummary";
import PickupSection from "./pdf/PickupSection";
import TruckDriverSection from "./pdf/TruckDriverSection";
import ConditionsSection from "./pdf/ConditionsSection";
import type { Truck } from "../../interfaces/create/order-trucks";
import type { QuotationProduct } from "../../interfaces/quotation";
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
});

interface PDFQuotationDocumentProps {
  data: {
    client: {
      RUC: string;
      nombre_comercial: string;
      razon_social: string;
    };
    inventory: Record<string, QuotationProduct>;
    truck: Truck;
    pickup: {
      pickupCost: number;
      pickupDate: string;
    };
    conditions: {
      emissionDate: string;
      expirationDate: string;
      conditions: string;
    };
  };
}

export const PdfDocument = ({ data }: PDFQuotationDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header />
      {/* <ClientInfo client={data.client} /> */}
      <InventoryTable items={data.inventory} />
      <TruckDriverSection truck={data.truck} />
      <PickupSection pickup={data.pickup} />
      <ConditionsSection conditions={data.conditions} />
      <CostSummary inventory={data.inventory} pickup={data.pickup} />
    </Page>
  </Document>
);
