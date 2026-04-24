import { Table, TableBody } from "@/shared/components/ui/table";
import { useEffect, useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/intranet/orders/interfaces/order";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { InventoryTableRow } from "./InventoryTableRow";
import { useOrderInventoryStore } from "@/intranet/quotation/hooks/stores/orderInventoryStore";
import { getFullOrderInventory } from "@/intranet/quotation/api/order.api";
import { Button } from "@/shared/components/ui/button";
import { PlusIcon, SquareChartGantt } from "lucide-react";
import { InventorySelectionDialog } from "./add/InventorySelectionDialog";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";
import { InventoryTableError } from "./InventoryTableError";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

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
      <Button
        className="mb-2 ml-auto flex"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusIcon /> Agregar producto
      </Button>
      <Card className="gap-4 border bg-card shadow-none">
        <CardHeader className="pb-0">
          <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
            <SquareChartGantt className="text-primary" />
            <span className="pb-0.5 font-[375] text-[18px]">
              {" "}
              Productos Cotizados
            </span>
          </CardTitle>
          <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
            Interactúa con los productos seleccionados por el cliente, cambia
            precios y cantidades, y elimina o agrega nuevos items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTableContent
            isPending={isPending}
            hasError={Boolean(error)}
          />
        </CardContent>
      </Card>
      <InventorySelectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
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
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <Table>
        <InventoryTableHeader />
        <TableBody>
          {isPending ? (
            <InventoryTableSkeleton />
          ) : hasError ? (
            <InventoryTableError />
          ) : (
            items.map((item) => (
              <InventoryTableRow key={item.id} inventoryElement={item} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
