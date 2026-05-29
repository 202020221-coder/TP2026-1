import type { ServicesState } from "@/intranet/quotation/hooks/stores/quotation.services.store";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  table: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#eee",
    padding: 4,
  },
  tableCol: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  tableCell: {
    fontSize: 10,
  },
});

const ServicesTable = ({ items }: { items: ServicesState["items"] }) => {
  const rows = Object.values(items);

  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>Servicio</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>Jornada</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>F. Inicio</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>F. Venc.</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>Precio</Text>
        </View>
      </View>

      {rows.map((item) => (
        <View style={styles.tableRow} key={item.id}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{item.name}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{item.schedule}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{item.startDate}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{item.dueDate}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>${item.unitPrice}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ServicesTable;
