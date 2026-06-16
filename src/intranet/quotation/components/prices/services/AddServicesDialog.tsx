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
  Ban,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Servicio } from "@/intranet/services/interfaces/service";
import {
  Controller,
  useWatch,
  type Control,
  type FieldArrayWithId,
} from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useAddServicesDialog, type AddServicesHandler } from "./useAddServicesDialog";
import type { AddServicesFormType } from "@/intranet/quotation/schemas/addServiceItem";

interface AddServicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addHandler: AddServicesHandler;
}

export const AddServicesDialog: FC<AddServicesDialogProps> = ({
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
    queryServicios,
    selectedItemsIds,
    selectedItems,
    formControl,
  } = useAddServicesDialog(open, onOpenChange, addHandler);

  const { isPending, isError, data } = queryServicios;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] min-w-11/12 max-w-5xl flex-col gap-5 p-0">
        <DialogHeader className="border-b border-border px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">Agregar servicios</DialogTitle>
          <DialogDescription>
            Navegue y seleccione servicios del catálogo, luego personalice
            precios y fechas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-1">
          {/* Services Catalog */}
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
              Agregar servicios
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface CatalogGridProps {
  items?: Servicio[];
  selectedIds: Set<string>;
  onToggleSelect: (item: Servicio, selected: boolean) => void;
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
    return <div>Error al traer catálogo de servicios</div>;
  }
  if (items!.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
        <p className="text-sm text-muted-foreground">
          No hay servicios disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items!.map((item) => {
        const isSelected = selectedIds.has(item.id.toString());
        const formattedPrice = Number(item.precio_regular).toFixed(2);

        return (
          <Card
            key={item.id}
            className={`overflow-hidden border bg-card transition-all duration-200 ${
              !item.activo
                ? "border-border/50 bg-muted/30 opacity-60 cursor-not-allowed"
                : isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30 cursor-pointer"
                  : "hover:border-primary/40 hover:bg-accent/20 cursor-pointer"
            }`}
            onClick={() => onToggleSelect(item, isSelected)}
          >
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Servicio #{item.id}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-tight text-foreground">
                    {item.nombre}
                  </h3>
                </div>
                {!item.activo && (
                  <Ban className="h-5 w-5 text-muted-foreground" />
                )}
                {isSelected && item.activo && (
                  <CheckCircle2 className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground" />
                )}
              </div>

              <p className="line-clamp-2 text-xs text-muted-foreground">
                {item.descripcion}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={item.activo ? "secondary" : "outline"}
                  className="text-xs font-medium"
                >
                  {item.activo ? "Activo" : "Desactivado"}
                </Badge>
              </div>

              <div className="flex items-end justify-between border-t border-border/80 pt-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Precio regular
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
  control: Control<AddServicesFormType>;
  selectedItems: FieldArrayWithId<AddServicesFormType, "items", "id">[];
  onRemoveItem: (itemId: string, index: number) => void;
}

const SelectedItemsList: FC<SelectedItemsListProps> = ({
  selectedItems,
  onRemoveItem,
  control,
}) => {
  const watchedItems = useWatch({
    control,
    name: "items",
  }) ?? [];

  if (selectedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
        <div className="rounded-full bg-muted p-2">
          <PackageSearch className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Aun no hay servicios seleccionados.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          Servicios seleccionados ({selectedItems.length})
        </h3>
      </div>

      <ScrollArea className="max-h-80 overflow-y-auto rounded-lg border border-border bg-card">
        <div className="space-y-2 p-4">
          {selectedItems.map((field, index) => {
            return (
              <Card
                key={field.id}
                className="overflow-hidden border-border bg-muted/50 p-4 shadow-none"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {watchedItems[index]?.name ?? field.name}
                      </h4>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onRemoveItem(field.id, index)
                      }
                      className="h-6 w-6 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Precio Unit.
                      </label>
                      <Controller
                        name={`items.${index}.unitPrice`}
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

                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Jornada (inicio / fin)
                      </label>
                      <div className="flex gap-2">
                        <Controller
                          name={`items.${index}.scheduleStart`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <div className="flex-1">
                              <Input
                                type="time"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="h-8 border-border bg-background text-xs"
                              />
                              {error && (
                                <p className="text-destructive font-bold text-sm">
                                  {error.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                        <Controller
                          name={`items.${index}.scheduleEnd`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <div className="flex-1">
                              <Input
                                type="time"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="h-8 border-border bg-background text-xs"
                              />
                              {error && (
                                <p className="text-destructive font-bold text-sm">
                                  {error.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        F. Inicio
                      </label>
                      <Controller
                        name={`items.${index}.startDate`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <Input
                              type="date"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
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
                        F. Vencimiento
                      </label>
                      <Controller
                        name={`items.${index}.dueDate`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <Input
                              type="date"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
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
                </div>
              </Card>
            );
          })}
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
