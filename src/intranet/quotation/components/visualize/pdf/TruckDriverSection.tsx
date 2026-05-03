import type { Truck } from "@/intranet/quotation/interfaces/create/order-trucks";
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
    width: "30%",
    fontSize: 10,
    fontWeight: "bold",
  },
  value: {
    width: "70%",
    fontSize: 10,
  },
});

const TruckDriverSection = ({ truck }: { truck: Truck }) => (
  <View style={styles.section}>
    <Text style={styles.title}>Camión y Conductor Asignado</Text>

    {/* Datos del conductor */}
    <View style={styles.row}>
      <Text style={styles.label}>Conductor:</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>DNI:</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Rol:</Text>
    </View>

    {/* Datos del camión */}
    <View style={styles.row}>
      <Text style={styles.label}>Placa:</Text>
      <Text style={styles.value}>{truck?.Placa}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Modelo:</Text>
      <Text style={styles.value}>
        {truck?.modelo} ({truck?.ano_fabricacion})
      </Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Color:</Text>
      <Text style={styles.value}>{truck?.color}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Próx. Revisión:</Text>
      <Text style={styles.value}>{truck?.fecha_prox_revision}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Características:</Text>
      <Text style={styles.value}>{truck?.caracteristicas}</Text>
    </View>
  </View>
);

export default TruckDriverSection;
