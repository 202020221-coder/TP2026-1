import type { PickupState } from "@/intranet/quotation/hooks/stores/quotation.pickup.store";
import { formatCurrency } from "@/shared/lib/format-currency";
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

const PickupSection = ({ pickup }: { pickup: PickupState }) => (
  <View style={styles.section}>
    <Text style={styles.title}>Servicio de Recojo</Text>

    <View style={styles.row}>
      <Text style={styles.label}>Fecha de Recojo:</Text>
      <Text style={styles.value}>{pickup?.pickupDate}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Costo de Recojo:</Text>
      <Text style={styles.value}>
        {formatCurrency(pickup?.pickupCost, "USD", 2)}
      </Text>
    </View>
  </View>
);

export default PickupSection;
