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

const ClientInfo = ({
  client,
}: {
  client: {
    RUC: string;
    nombre_comercial: string;
    razon_social: string;
  };
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>Datos del Cliente</Text>

    <View style={styles.row}>
      <Text style={styles.label}>RUC/DNI:</Text>
      <Text style={styles.value}>{client.RUC}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Nombre Comercial:</Text>
      <Text style={styles.value}>{client.nombre_comercial}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Razón Social:</Text>
      <Text style={styles.value}>{client.razon_social}</Text>
    </View>
  </View>
);

export default ClientInfo;
