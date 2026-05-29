import type { QuotationProduct } from "@/intranet/quotation/interfaces/quotation";
import type { DesiredQuotationData } from "@/intranet/quotation/interfaces/upsert/desiredQuotationInitialData";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

type Service = DesiredQuotationData["services"][number];

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#000",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "40%",
    fontSize: 10,
    fontWeight: "bold",
  },
  value: {
    width: "60%",
    fontSize: 10,
  },
});

const CostSummary = ({
  inventory,
  services,
  pickup,
}: {
  inventory: Record<QuotationProduct["id"], QuotationProduct>;
  services: Record<Service["id"], Service>;
  pickup: { pickupCost: number; pickupDate: string };
}) => {
  const inventorySubtotal = Object.values(inventory).reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0,
  );
  const servicesSubtotal = Object.values(services).reduce(
    (acc, item) => acc + (Number(item.unitPrice) || 0),
    0,
  );
  const subtotal = inventorySubtotal + servicesSubtotal;
  
  //TODO: String cuando es decimal??
  const total = Number(subtotal) + Number(pickup?.pickupCost || 0);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Resumen de Costos</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal Inventario:</Text>
        <Text style={styles.value}>${inventorySubtotal}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Servicios:</Text>
        <Text style={styles.value}>${servicesSubtotal}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Costo de Recojo:</Text>
        <Text style={styles.value}>${pickup?.pickupCost}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total:</Text>
        <Text style={styles.value}>${total}</Text>
      </View>
    </View>
  );
};

export default CostSummary;
