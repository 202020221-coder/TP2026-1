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

export const InventoryTable: FC<{ orderId: Order["ID"] }> = ({ orderId }) => {
  const [isDialogOpen,setIsDialogOpen] = useState(false)
  
  const { data, isPending, error } = useQuery({
    queryKey: ["order", "inventory", orderId],
    queryFn: () => getFullOrderInventory(orderId),
    staleTime: Infinity,
  });
  const initializeItems = useOrderInventoryStore((s) => s.initializeItems);
  useEffect(() => {
    if (data) {
      console.log(data);

      initializeItems(data);
    }
  }, [data]);
  if (isPending) return <p>cargandoo....</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      <Button className="ml-auto flex mb-2" onClick={()=>setIsDialogOpen(true)}>
        <PlusIcon /> Agregar producto
      </Button>
      <InventoryTableContent />
      <InventorySelectionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
    </>
  );
};

const InventoryTableContent = () => {
  const itemsObj = useOrderInventoryStore((s) => s.items);

  const items = Object.values(itemsObj);
  return (
    <Table>
      <InventoryTableHeader />
      <TableBody>
        {items.map((item) => (
          <InventoryTableRow key={item.id} inventoryElement={item} />
        ))}
      </TableBody>
    </Table>
  );
};
