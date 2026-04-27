import type { ConditionState } from "@/intranet/quotation/hooks/stores/conditions.store";
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
  conditionsText: {
    fontSize: 10,
    marginTop: 6,
    lineHeight: 1.4,
  },
});

const ConditionsSection = ({ conditions }: { conditions: ConditionState }) => (
  <View style={styles.section}>
    <Text style={styles.title}>Condiciones de la Cotización</Text>

    <View style={styles.row}>
      <Text style={styles.label}>Fecha de Emisión:</Text>
      <Text style={styles.value}>{conditions?.emissionDate}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Fecha de Expiración:</Text>
      <Text style={styles.value}>{conditions?.expirationDate}</Text>
    </View>

    <Text style={styles.conditionsText}>{conditions?.conditions}</Text>
  </View>
);

export default ConditionsSection;
