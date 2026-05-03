import type { PickupState } from "@/intranet/quotation/hooks/stores/quotation.pickup.store";
import type { QuotationProduct } from "@/intranet/quotation/interfaces/quotation";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

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
  pickup,
}: {
  inventory: Record<QuotationProduct["id"], QuotationProduct>;
  pickup: PickupState;
}) => {
  const subtotal = Object.values(inventory).reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0,
  );
  const total = subtotal + (pickup?.pickupCost || 0);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Resumen de Costos</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal Inventario:</Text>
        <Text style={styles.value}>${subtotal}</Text>
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
