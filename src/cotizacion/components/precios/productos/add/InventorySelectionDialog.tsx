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
import { Loader2 } from "lucide-react";
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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col min-w-11/12">
        <DialogHeader>
          <DialogTitle>Agregar inventario</DialogTitle>
          <DialogDescription>
            Navegue y seleccione items del catálogo, luego personalice
            cantidades y detalles
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-6">
          {/* Inventory Catalog */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Catálogo</h3>
              <CatalogGrid
                items={items}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                isLoading={isLoadingInventory}
              />
            </div>

            {/* Pagination */}
            {!isLoadingInventory && totalPages > 1 && (
              <div className="border-t border-gray-200 pt-4">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  isLoading={isLoadingInventory}
                />
              </div>
            )}
          </div>

          {/* Selected Items */}
          <div className="border-t border-gray-200 pt-6">
            <SelectedItemsList
              control={SelectInventoryFormControl}
              selectedItems={fields}
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 flex items-center justify-end gap-3 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={selectedIds.size === 0 || isConfirming}
            className="relative"
          >
            {isConfirming && <Loader2 className="animate-spin" />}
            <span className={isConfirming ? "ml-2" : ""}>
              Confirmar seleccion
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { InventorySelectionDialogProps };
