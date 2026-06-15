import { Plus, SquareChartGantt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useMemo, useState, type FC } from "react";
import { QuotationProductsTable } from "./ProductsTable";
import { useQuotationProductStore } from "@/intranet/quotation/hooks/stores/quotation.products.store.provider";
import { Button } from "@/shared/components/ui/button";
import { AddProductsDialog } from "./AddProductsDialog";
import { CreateQuotationPickupSection } from "../delivery/CreateQuotationPickupSection";
import type { QuotationProduct } from "@/intranet/quotation/interfaces/quotation";
export const CreateQuotationProductsSection: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const items = useQuotationProductStore((s) => s.items);
  const deleteItem = useQuotationProductStore((s) => s.removeItem);
  const updateItem = useQuotationProductStore((s) => s.updateItem);
  const addItems = useQuotationProductStore((s) => s.addItems);
  const products = useMemo(() => {
    return Object.values(items);
  }, [items]);
  return (
    <Card className="gap-4 border bg-card shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <SquareChartGantt className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Productos Cotizados
          </span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          Interactúa con los productos seleccionados por el cliente, cambia
          precios y cantidades, y elimina o agrega nuevos items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="ml-auto flex mb-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus /> Agregar Productos
        </Button>
        <AddProductsDialog
          addHandler={(items) =>
            addItems(
              items.map((i): QuotationProduct => {
                if (i.intencion === "alquilar") {
                  return {
                    id: i.idInventario,
                    cantidad: i.cantidad,
                    intencion: "alquilar",
                    nombre: i.nombre,
                    precio_unitario: i.precio_unitario,
                    dias_alquilados: i.dias_alquilados,
                  };
                }
                return {
                  id: i.idInventario,
                  cantidad: i.cantidad,
                  intencion: "comprar",
                  nombre: i.nombre,
                  precio_unitario: i.precio_unitario,
                  dias_alquilados: null,
                };
              }),
            )
          }
          onOpenChange={setIsDialogOpen}
          open={isDialogOpen}
        />
        <QuotationProductsTable
          items={products}
          onDelete={deleteItem}
          onUpdateQuantity={(id, quantity) =>
            updateItem(id, "cantidad", quantity)
          }
          onUpdateUnitPrice={(id, unitPrice) =>
            updateItem(id, "precio_unitario", unitPrice)
          }
          onUpdateIntention={(id, intention) =>
            updateItem(id, "intencion", intention)
          }
          onUpdateRentedDays={(id, dias) =>
            updateItem(id, "dias_alquilados", dias)
          }
          readOnly={false}
        />

        {/* El delivery se cotiza junto a los productos. */}
        <div className="mt-4">
          <CreateQuotationPickupSection />
        </div>
      </CardContent>
    </Card>
  );
};
