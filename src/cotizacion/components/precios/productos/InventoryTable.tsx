import { Button } from "@/shared/components/ui/button";
import { Table, TableBody } from "@/shared/components/ui/table";
import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/solicitudes/interfaces/order";
import { getOrderInventory } from "@/cotizacion/api/order.api";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { InventoryTableRow } from "./InventoryTableRow";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";
import { InventoryTableError } from "./InventoryTableError";

export const InventoryTable: FC<{ orderId: Order["ID"] }> = ({ orderId }) => {
  // const client = useQueryClient();
  const { error, isPending, data } = useQuery({
    queryKey: ["order", "inventory", orderId],
    queryFn: () => getOrderInventory(orderId),
  });

  if (error) {
    return <InventoryTableError />;
  }
  return (
    <>
      <Button className="ml-auto block mb-2" disabled={isPending}>
        Agregar producto
      </Button>
      <Table>
        <InventoryTableHeader />
        <TableBody>
          {isPending ? (
            <InventoryTableSkeleton />
          ) : (
            data.map((item) => (
              <InventoryTableRow
                key={`${item.id}-${item.ID_Inventario}-${item.ID_Solicitud}`}
                inventoryItem={item}
              />
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
