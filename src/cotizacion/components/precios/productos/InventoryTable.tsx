import { Table, TableBody } from "@/shared/components/ui/table";
import { useEffect, useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/solicitudes/interfaces/order";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { InventoryTableRow } from "./InventoryTableRow";
import { useOrderInventoryStore } from "@/cotizacion/hooks/stores/orderInventoryStore";
import { getFullOrderInventory } from "@/cotizacion/api/order.api";
import { Button } from "@/shared/components/ui/button";
import { PlusIcon } from "lucide-react";
import { InventorySelectionDialog } from "./add/InventorySelectionDialog";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";
import { InventoryTableError } from "./InventoryTableError";

export const InventoryTable: FC<{ orderId: Order["ID"] }> = ({ orderId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isPending, error } = useQuery({
    queryKey: ["order", "inventory", orderId],
    queryFn: () => getFullOrderInventory(orderId),
    staleTime: Infinity,
  });
  const initializeItems = useOrderInventoryStore((s) => s.initializeItems);
  useEffect(() => {
    if (data) {
      initializeItems(data);
    }
  }, [data, initializeItems]);

  return (
    <>
      <Button className="mb-2 ml-auto flex" onClick={() => setIsDialogOpen(true)}>
        <PlusIcon /> Agregar producto
      </Button>
      <InventoryTableContent isPending={isPending} hasError={Boolean(error)} />
      <InventorySelectionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};

const InventoryTableContent: FC<{ isPending: boolean; hasError: boolean }> = ({
  isPending,
  hasError,
}) => {
  const itemsObj = useOrderInventoryStore((s) => s.items);

  const items = Object.values(itemsObj);
  return (
    <Table>
      <InventoryTableHeader />
      <TableBody>
        {isPending ? (
          <InventoryTableSkeleton />
        ) : hasError ? (
          <InventoryTableError />
        ) : (
          items.map((item) => <InventoryTableRow key={item.id} inventoryElement={item} />)
        )}
      </TableBody>
    </Table>
  );
};
