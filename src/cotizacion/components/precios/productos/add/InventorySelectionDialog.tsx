import { useCallback, useState /*useCallback*/ } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { CatalogGrid } from "./CatalogGrid";
import { SelectedItemsList } from "./SelectedItemsList";
import { PaginationControls } from "./PaginationControls";
import {
  SelectInventoryFormSchema,
  type SelectInventoryFormType,
} from "@/cotizacion/schemas/addInventoryItem";
import { Loader2, PackageSearch, ListChecks } from "lucide-react";
import { getInventoryItems } from "@/cotizacion/api/inventory.api";
import type {
  InventoryItem,
  OrderInventoryTableElement,
} from "@/cotizacion/interfaces/create/order-inventory";
import { getInventoryItemManufacturer } from "@/cotizacion/api/order.api";
import type { OrderInventoryItemIntention } from "@/cotizacion/enum/order-inventory-intention";
import { useOrderInventoryStore } from "@/cotizacion/hooks/stores/orderInventoryStore";

interface InventorySelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventorySelectionDialog({
  open,
  onOpenChange,
  // onConfirm,
}: InventorySelectionDialogProps) {
  const addItems = useOrderInventoryStore((s) => s.addItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isConfirming, setIsConfirming] = useState(false);
  const {
    control: SelectInventoryFormControl,
    trigger,
    getValues,
  } = useForm<SelectInventoryFormType>({
    resolver: zodResolver(SelectInventoryFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: SelectInventoryFormControl,
    name: "items",
  });

  // Fetch inventory items with React Query
  const { data: inventoryData, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory", currentPage],
    queryFn: () => getInventoryItems({ page: currentPage }),
    enabled: open,
  });

  const handleToggleSelect = useCallback(
    (item: InventoryItem, selected: boolean) => {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        const ItemID = item.Id_Objeto.toString();
        if (selected) {
          newSet.delete(ItemID);
        } else {
          newSet.add(ItemID);
        }
        return newSet;
      });

      if (selected) {
        //delete from fields
        const deleteFieldIndex = fields.findIndex(
          (field) => field.idInventario === item.Id_Objeto.toString(),
        );

        remove(deleteFieldIndex);
      } else {
        //add to fields
        append({
          /**campos visuales */
          idInventario: item.Id_Objeto.toString(),
          idFabricante: item.ID_Fabricante.toString(),
          estado: item.estado,
          precio_comercial: Number(item.precio_comercial),
          nombre: item.nombre_objeto,
          /**campos modificables por el usuario */
          intencion: "",
          cantidad: 0,
          precio_unitario: 0.0,
        });
      }
    },
    [],
  );

  const handleRemoveItem = useCallback(
    (itemId: string, deleteFieldIndex: number) => {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      remove(deleteFieldIndex);
    },
    [],
  );

  const handleConfirm = async () => {
    setIsConfirming(true);
    const errors = await trigger();
    if (errors) {
      alert("Hubieron errores al llenar el formulario");
      setIsConfirming(false);
      return;
    }

    const inventoryItemsCollected = getValues().items;

    // Create promises to fetch manufacturer info in parallel
    const manufacturerPromises = inventoryItemsCollected.map((item) =>
      getInventoryItemManufacturer(Number(item.idFabricante)),
    );

    const manufacturers = await Promise.all(manufacturerPromises);

    // Add manufacturer name to each item
    const newTableElements: OrderInventoryTableElement[] =
      inventoryItemsCollected.map((item, index) => ({
        fabricante: manufacturers[index].nombre_comercial,
        cantidad: item.cantidad,
        estado: item.estado,
        id: item.idInventario,
        intencion: item.intencion as OrderInventoryItemIntention,
        producto: item.nombre,
        precio_unitario: item.precio_unitario,
      }));

    alert("Items agregados con exito");

    addItems(newTableElements);

    handleClose();
  };

  const handleClose = () => {
    setCurrentPage(1);
    // setSelectedItems([]);
    setSelectedIds(new Set());
    onOpenChange(false);
  };

  const items = inventoryData?.data || [];
  const totalPages = inventoryData?.pagination.totalPages || 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] min-w-11/12 max-w-5xl flex-col gap-5 p-0">
        <DialogHeader className="border-b border-border px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">Agregar inventario</DialogTitle>
          <DialogDescription>
            Navegue y seleccione items del catálogo, luego personalice
            cantidades y detalles
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-1">
          {/* Inventory Catalog */}
          <section className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <PackageSearch className="h-4 w-4 text-primary" />
                Catálogo
              </h3>
              <span className="text-xs text-muted-foreground">
                {isLoadingInventory ? "Cargando..." : `${items.length} resultados`}
              </span>
            </div>
            <div>
              <CatalogGrid
                items={items}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                isLoading={isLoadingInventory}
              />
            </div>

            {/* Pagination */}
            {!isLoadingInventory && totalPages > 1 && (
              <div className="border-t border-border/80 pt-4">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  isLoading={isLoadingInventory}
                />
              </div>
            )}
          </section>

          {/* Selected Items */}
          <section className="space-y-4 rounded-lg border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <ListChecks className="h-4 w-4 text-primary" />
              Selección actual
            </h3>
            <SelectedItemsList
              control={SelectInventoryFormControl}
              selectedItems={fields}
              onRemoveItem={handleRemoveItem}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isConfirming}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={selectedIds.size === 0 || isConfirming}
            className="relative min-w-44"
          >
            {isConfirming && <Loader2 className="h-4 w-4 animate-spin" />}
            <span className={isConfirming ? "ml-2" : ""}>
              Confirmar selección
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { InventorySelectionDialogProps };
