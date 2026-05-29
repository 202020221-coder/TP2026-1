import type { TruckState } from "@/intranet/quotation/hooks/stores/quotation.truck.store";
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
  truckBlock: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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

const TruckDriverSection = ({
  trucks,
}: {
  trucks: TruckState["selectedTrucks"];
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>Camiones Asignados</Text>

    {trucks.length === 0 ? (
      <Text style={{ fontSize: 10 }}>No hay camiones asignados.</Text>
    ) : (
      trucks.map((truck, index) => (
        <View
          key={truck.plate}
          style={index < trucks.length - 1 ? styles.truckBlock : undefined}
        >
          <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 4 }}>
            Camión {index + 1}
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Placa:</Text>
            <Text style={styles.value}>{truck.plate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Modelo:</Text>
            <Text style={styles.value}>{truck.model}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Color:</Text>
            <Text style={styles.value}>{truck.color}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Próx. Revisión:</Text>
            <Text style={styles.value}>{truck.maintenanceDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Características:</Text>
            <Text style={styles.value}>{truck.description}</Text>
          </View>
        </View>
      ))
    )}
  </View>
);

export default TruckDriverSection;
