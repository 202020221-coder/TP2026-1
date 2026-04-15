import type { OrderInventoryTableElement } from "@/cotizacion/interfaces/create/order-inventory";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

// Estilos locales para la tabla
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

// Componente que recibe los items desde el store
const InventoryTable = ({
  items,
}: {
  items: Record<OrderInventoryTableElement["id"], OrderInventoryTableElement>;
}) => {
  const rows = Object.values(items);

  return (
    <View style={styles.table}>
      {/* Encabezado */}
      <View style={styles.tableRow}>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>Producto</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>Fabricante</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>Estado</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>Cantidad</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>P.Unit</Text>
        </View>
        <View style={styles.tableColHeader}>
          <Text style={styles.tableCell}>Subtotal</Text>
        </View>
      </View>

      {/* Filas dinámicas */}
      {rows.map((item) => (
        <View style={styles.tableRow} key={item.id}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{item.producto}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{item.fabricante}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{item.estado}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{item.cantidad}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>${item.precio_unitario}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              ${item.cantidad * item.precio_unitario}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default InventoryTable;
