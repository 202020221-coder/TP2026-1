import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import Header from "./pdf/Header";
import ClientInfo from "./pdf/ClientInfo";
import InventoryTable from "./pdf/InventoryTable";
import CostSummary from "./pdf/CostSummary";
import PickupSection from "./pdf/PickupSection";
import TruckDriverSection from "./pdf/TruckDriverSection";
import ConditionsSection from "./pdf/ConditionsSection";
import type { ConditionState } from "../../hooks/stores/quotation.conditions.store";
import type { PickupState } from "../../hooks/stores/quotation.pickup.store";
import type { TruckState } from "../../hooks/stores/quotation.truck.store";
import type { ProductsState } from "../../hooks/stores/quotation.products.store";
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
});

export interface PDFQuotationDocumentProps {
  data: {
    client: {
      RUC: string;
      nombre_comercial: string;
      razon_social: string;
    };
    inventory: ProductsState["items"];
    trucks: TruckState["selectedTrucks"];
    pickup: PickupState;
    conditions: ConditionState
  };
}

export const PdfDocument = ({ data }: PDFQuotationDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header />
      <ClientInfo client={data.client} />
      <InventoryTable items={data.inventory} />
      <TruckDriverSection trucks={data.trucks} />
      <PickupSection pickup={data.pickup} />
      <ConditionsSection conditions={data.conditions} />
      <CostSummary inventory={data.inventory} pickup={data.pickup} />
    </Page>
  </Document>
);
