import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Eraser } from "lucide-react";
import type { FC } from "react";
// import { useDebouncedCallback } from "@src/shared/hooks/useDebouncedCallback";
import { useQuery } from "@tanstack/react-query";
import {
  getInventoryItemManufacturer,
  getOrderInventoryItem,
} from "@/cotizacion/api/order.api";
// import { useDebounced } from "@/shared/hooks/useDebounced";
import type { OrderInventoryElementItem } from "@/cotizacion/interfaces/create/order-inventory";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const InventoryTableRow: FC<{
  inventoryItem: OrderInventoryElementItem;
}> = ({ inventoryItem }) => {
  const { status: inventoryItemStatus, data: inventoryItemData } = useQuery({
    queryKey: ["order", "inventory", inventoryItem.ID_Inventario],
    queryFn: () => getOrderInventoryItem(inventoryItem.ID_Inventario),
  });

  const manufacturerId = inventoryItemData?.ID_Fabricante;

  const { status: itemManufacturerStatus, data: itemManufacturerData } =
    useQuery({
      queryKey: ["order", "inventory", "item", "manufacturer", manufacturerId],
      queryFn: () => getInventoryItemManufacturer(manufacturerId!),
      enabled: !!manufacturerId,
    });

  if (inventoryItemStatus === "error" || itemManufacturerStatus === "error") {
    return (
      <TableRow>
        <TableCell colSpan={9}>
          Error al traer detalles del inventario
        </TableCell>
      </TableRow>
    );
  }
  return (
    <TableRow
      key={inventoryItem.ID_Inventario}
      className="hover:bg-muted/40 transition-colors"
    >
      <TableCell className="whitespace-break-spaces">
        {inventoryItemStatus === "pending" ? (
          <Skeleton className="h-4 w-[80%] bg-gray-300" />
        ) : (
          inventoryItemData.nombre_objeto
        )}
      </TableCell>
      <TableCell>{inventoryItem.ID_Inventario}</TableCell>
      <TableCell className="whitespace-break-spaces">
        {itemManufacturerStatus === "pending" ? (
          <Skeleton className="h-4 w-[70%] bg-gray-300" />
        ) : (
          itemManufacturerData.nombre_comercial
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell text-center">
        {inventoryItemStatus === "pending" ? (
          <Skeleton className="h-4 w-16 mx-auto bg-gray-300" />
        ) : (
          inventoryItemData.estado
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell text-center">
        {inventoryItem.intencion}
      </TableCell>
      <TableCell className="hidden lg:table-cell text-center">
        <Input
          type="number"
          min={0}
          max={100}
          defaultValue={Number(inventoryItem.cantidad)}
        />
      </TableCell>
      <TableCell className="hidden lg:table-cell text-center">
        <Input
          type="number"
          min={0}
          max={100}
          disabled={
            inventoryItem.intencion === "comprar" &&
            inventoryItemStatus === "pending"
          }
          defaultValue={
            inventoryItem.intencion === "comprar" &&
            inventoryItemStatus !== "pending"
              ? Number(inventoryItemData.precio_comercial)
              : undefined
          }
        />
      </TableCell>
      <TableCell className="text-right font-medium">
        subtotal calculado
      </TableCell>
      <TableCell className="text-center">
        <Button size={"icon"}>
          <Eraser />
        </Button>
      </TableCell>
    </TableRow>
  );
};
