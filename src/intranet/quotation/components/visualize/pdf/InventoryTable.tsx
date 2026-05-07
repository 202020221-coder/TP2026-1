import type { QuotationProduct } from "@/intranet/quotation/interfaces/quotation";
import { formatCurrency } from "@/shared/lib/format-currency";
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
  items: Record<QuotationProduct["id"], QuotationProduct>;
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
            <Text style={styles.tableCell}>{item.nombre}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{item.cantidad}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>${item.precio_unitario}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {formatCurrency(item.cantidad * item.precio_unitario, "USD", 2)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default InventoryTable;
