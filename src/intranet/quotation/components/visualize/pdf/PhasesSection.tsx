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

const PhasesSection = ({
  phases,
}: {
  phases: { quantity: number; duration: number };
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>Fases de la Cotización</Text>

    <View style={styles.row}>
      <Text style={styles.label}>Cantidad de Fases:</Text>
      <Text style={styles.value}>{phases.quantity}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Duración por Fase:</Text>
      <Text style={styles.value}>{phases.duration} día(s)</Text>
    </View>
  </View>
);

export default PhasesSection;
