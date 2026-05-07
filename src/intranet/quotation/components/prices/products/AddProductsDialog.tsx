import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
  PackageSearch,
  ListChecks,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { type SelectInventoryFormType } from "@/intranet/quotation/schemas/addInventoryItem";
import type { InventoryItem } from "@/intranet/quotation/interfaces/create/order-inventory";
import {
  Controller,
  // useWatch,
  type Control,
  type FieldArrayWithId,
} from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { QuotationProductIntentionsRecord } from "@/intranet/quotation/enum/order-inventory-intention";
import { useAddProductsDialog, type AddHandler } from "./useAddProductsDialog";

interface AddProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addHandler: AddHandler;
}

export const AddProductsDialog: FC<AddProductsDialogProps> = ({
  open,
  onOpenChange,
  addHandler,
}) => {
  const {
    toggleItem,
    removeItem,
    setCurrentPage,
    confirm,
    handleClose,
    isConfirming,
    queryInventory,
    selectedItemsIds,
    selectedItems,
    formControl,
  } = useAddProductsDialog(open, onOpenChange, addHandler);

  const { isPending, isError, data } = queryInventory;
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
              {!isError && (
                <span className="text-xs text-muted-foreground">
                  {isPending ? "Cargando..." : `${data.data.length} resultados`}
                </span>
              )}
            </div>
            <div>
              <CatalogGrid
                items={data?.data}
                isError={isError}
                selectedIds={selectedItemsIds}
                onToggleSelect={toggleItem}
                isPending={isPending}
              />
            </div>

            {/* Pagination */}
            {!isError && (
              <div className="border-t border-border/80 pt-4">
                <PaginationControls
                  currentPage={data?.pagination.page || 1}
                  totalPages={data?.pagination.totalPages || 1}
                  onPageChange={setCurrentPage}
                  isPending={isPending}
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
              control={formControl}
              selectedItems={selectedItems}
              onRemoveItem={removeItem}
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
            onClick={confirm}
            disabled={selectedItemsIds.size === 0 || isConfirming}
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
};

interface CatalogGridProps {
  items?: InventoryItem[];
  selectedIds: Set<string>;
  onToggleSelect: (item: InventoryItem, selected: boolean) => void;
  isPending: boolean;
  isError: boolean;
}

const CatalogGrid: FC<CatalogGridProps> = ({
  items,
  selectedIds,
  onToggleSelect,
  isPending,
  isError,
}) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error al traer catalogo</div>;
  }
  if (items!.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
        <p className="text-sm text-muted-foreground">
          No hay insumos del inventario disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items!.map((item) => {
        const isSelected = selectedIds.has(item.Id_Objeto.toString());
        const formattedPrice = Number(item.precio_comercial).toFixed(2);

        return (
          <Card
            key={item.Id_Objeto}
            className={`cursor-pointer overflow-hidden border bg-card transition-all duration-200 ${
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                : "hover:border-primary/40 hover:bg-accent/20"
            }`}
            onClick={() => onToggleSelect(item, isSelected)}
          >
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Item #{item.Id_Objeto}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-tight text-foreground">
                    {item.nombre_objeto}
                  </h3>
                </div>
                {isSelected && (
                  <CheckCircle2 className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  Estado: {item.estado}
                </Badge>
                <Badge variant="outline" className="text-xs font-medium">
                  Stock: {item.cantidad}
                </Badge>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="line-clamp-1">
                  <span className="font-medium text-foreground/80">
                    Almacén:
                  </span>{" "}
                  {item.lugar_almacenaje}
                </p>
                <p className="line-clamp-1">
                  <span className="font-medium text-foreground/80">Serie:</span>{" "}
                  {item.numero_serial}
                </p>
                <p className="line-clamp-1">
                  <span className="font-medium text-foreground/80">
                    Fabricación:
                  </span>{" "}
                  {item.ano_fabricacion}
                </p>
              </div>

              <div className="flex items-end justify-between border-t border-border/80 pt-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Precio comercial
                </span>
                <span className="text-lg font-bold text-foreground">
                  ${formattedPrice}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

interface SelectedItemsListProps {
  control: Control<SelectInventoryFormType>;
  selectedItems: FieldArrayWithId<SelectInventoryFormType, "items", "id">[];
  onRemoveItem: (itemId: string, index: number) => void;
}

const SelectedItemsList: FC<SelectedItemsListProps> = ({
  selectedItems,
  onRemoveItem,
  control,
}) => {

  // const watch = useWatch({control, name:`items.${index}.intencion`})
  if (selectedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
        <div className="rounded-full bg-muted p-2">
          <PackageSearch className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Aun no hay items seleccionados.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          Items seleccionados ({selectedItems.length})
        </h3>
      </div>

      <ScrollArea className="max-h-80 overflow-y-auto rounded-lg border border-border bg-card">
        <div className="space-y-2 p-4">
          {selectedItems.map((field, index) => (
            <Card
              key={field.id}
              className="overflow-hidden border-border bg-muted/50 p-4 shadow-none"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">
                        {field.nombre}
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Precio Comercial: ${field.precio_comercial.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(field.idInventario, index)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Cantidad
                    </label>
                    <Controller
                      name={`items.${index}.cantidad`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            type="number"
                            min={1}
                            max={1000}
                            placeholder="Qty"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="h-8 border-border bg-background text-xs"
                          />
                          {error && (
                            <p className="text-destructive font-bold text-sm">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Precio Unit.
                    </label>
                    <Controller
                      name={`items.${index}.precio_unitario`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            type="number"
                            step={0.01}
                            min={0.01}
                            placeholder="Price"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="h-8 border-border bg-background text-xs"
                          />
                          {error && (
                            <p className="text-destructive font-bold text-sm">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Intención
                  </label>
                  <Controller
                    name={`items.${index}.intencion`}
                    control={control}
                    render={({
                      field,
                      fieldState: { error, invalid, isValidating },
                    }) => (
                      <>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            aria-invalid={invalid}
                            disabled={isValidating}
                            className="h-8 border-border bg-background text-xs"
                          >
                            <SelectValue placeholder="Seleccione la intención" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(
                              QuotationProductIntentionsRecord,
                            ).map((value, i) => (
                              <SelectItem key={`${i}-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {error && (
                          <p className="text-destructive font-bold text-sm">
                            {error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isPending = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={isPending}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        className="flex items-center gap-1"
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </Button>

      <span className="text-xs text-muted-foreground">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
};
