import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Eraser } from "lucide-react";
import type { FC } from "react";
import type { OrderInventoryTableElement } from "@/cotizacion/interfaces/create/order-inventory";
import { useOrderInventoryStore } from "@/cotizacion/hooks/stores/orderInventoryStore";

export const InventoryTableRow: FC<{
  inventoryElement: OrderInventoryTableElement;
}> = ({ inventoryElement }) => {
  const updateItem = useOrderInventoryStore((s) => s.updateItem);
  const deleteItem = useOrderInventoryStore((s) => s.removeItem);
  return (
    <TableRow
      key={inventoryElement.id}
      className="hover:bg-muted/40 transition-colors"
    >
      <TableCell className="whitespace-break-spaces">
        {inventoryElement.producto}
      </TableCell>
      <TableCell>{inventoryElement.id}</TableCell>
      <TableCell>{inventoryElement.fabricante}</TableCell>
      <TableCell className=" text-center">{inventoryElement.estado}</TableCell>
      <TableCell className=" text-center">
        {inventoryElement.intencion}
      </TableCell>
      <TableCell className=" text-center">
        <Input
          type="number"
          min={0}
          value={inventoryElement.cantidad}
          onChange={(e) =>
            updateItem(inventoryElement.id, "cantidad", Number(e.target.value))
          }
        />
      </TableCell>
      <TableCell className=" text-center">
        <Input
          type="number"
          value={inventoryElement.precio_unitario}
          onChange={(e) =>
            updateItem(
              inventoryElement.id,
              "precio_unitario",
              Number(e.target.value),
            )
          }
        />
      </TableCell>
      <TableCell className="text-right font-medium">
        {inventoryElement.precio_unitario * inventoryElement.cantidad}
      </TableCell>
      <TableCell className="text-center">
        <Button size={"icon"} onClick={() => deleteItem(inventoryElement.id)}>
          <Eraser />
        </Button>
      </TableCell>
    </TableRow>
  );
};
