import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Eraser } from "lucide-react";
import type { FC } from "react";
import type { OrderInventoryTableElement } from "@/intranet/quotation/interfaces/create/order-inventory";
import { useOrderInventoryStore } from "@/intranet/quotation/hooks/stores/orderInventoryStore";

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
          className="h-9 border-border bg-background text-sm"
          onChange={(e) =>
            updateItem(inventoryElement.id, "cantidad", Number(e.target.value))
          }
        />
      </TableCell>
      <TableCell className=" text-center">
        <Input
          type="number"
          value={inventoryElement.precio_unitario}
          className="h-9 border-border bg-background text-sm"
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
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => deleteItem(inventoryElement.id)}
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
