import { useMemo, useState } from "react";
import { ArrowLeft, Check, Eye, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { useNavigate } from "react-router";
import { useTruckInventory } from "../hooks/useTruckInventory";
import type {
  TruckInventoryRow,
} from "../interfaces/truck.interface";

type InventoryFormState = {
  Id_Objeto: string;
  cantidad_requerida: string;
  cantidad_actual: string;
  ubicacion_en_camion: string;
  requerido_legal: "si" | "no";
};

const getInitialInventoryForm = (): InventoryFormState => ({
  Id_Objeto: "",
  cantidad_requerida: "",
  cantidad_actual: "",
  ubicacion_en_camion: "",
  requerido_legal: "si",
});

const mapItemToInventoryForm = (item: TruckInventoryRow): InventoryFormState => ({
  Id_Objeto: String(item.Id_Objeto),
  cantidad_requerida: String(item.cantidad_requerida),
  cantidad_actual: String(item.cantidad_actual),
  ubicacion_en_camion: item.ubicacion_en_camion,
  requerido_legal: item.requerido_legal,
});

const isInventoryFormValid = (form: InventoryFormState) => {
  const numericValues = [
    form.Id_Objeto,
    form.cantidad_requerida,
    form.cantidad_actual,
  ];

  const hasValidNumbers = numericValues.every((value) => {
    if (value.trim() === "") {
      return false;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0;
  });

  return hasValidNumbers && form.ubicacion_en_camion.trim().length > 0;
};

const mapInventoryFormToPayload = (form: InventoryFormState) => ({
  Id_Objeto: Number(form.Id_Objeto),
  cantidad_requerida: Number(form.cantidad_requerida),
  cantidad_actual: Number(form.cantidad_actual),
  ubicacion_en_camion: form.ubicacion_en_camion.trim(),
  requerido_legal: form.requerido_legal,
});

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const renderDetailPairs = (pairs: Array<[string, unknown]>) =>
  pairs.map(([label, value]) => (
    <div
      key={label}
      className="flex items-start justify-between gap-4 border-b border-dashed border-gray-200 pb-2 last:border-b-0 last:pb-0"
    >
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-right font-medium text-foreground">
        {formatValue(value)}
      </span>
    </div>
  ));

export function TruckInventoryPage() {
  const navigate = useNavigate();
  const {
    placa,
    inventario,
    isLoading,
    error,
    asignarInventario,
    desasignarInventario,
  } = useTruckInventory();

  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(
    null,
  );
  const [itemToView, setItemToView] = useState<TruckInventoryRow | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isViewItemDialogOpen, setIsViewItemDialogOpen] = useState(false);

  const [inventoryForm, setInventoryForm] = useState<InventoryFormState>(
    getInitialInventoryForm,
  );
  const [editingInventoryForm, setEditingInventoryForm] =
    useState<InventoryFormState>(getInitialInventoryForm);

  const itemDetalle = itemToView?.detalle ?? null;
  const objectName =
    itemToView?.detalle?.nombre_objeto?.trim() ||
    (itemToView ? `Objeto #${itemToView.Id_Objeto}` : "-");

  const lowStockCount = useMemo(() => {
    return inventario.filter(
      (item) => item.cantidad_actual < item.cantidad_requerida,
    ).length;
  }, [inventario]);

  const hasInlineEditing = editingItemId !== null;
  const isCreateFormValid = isInventoryFormValid(inventoryForm);

  const onSubmitInventoryForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = await asignarInventario(
      mapInventoryFormToPayload(inventoryForm),
    );

    if (!success) {
      return;
    }

    setIsAddItemDialogOpen(false);
    setInventoryForm(getInitialInventoryForm());
  };

  const onDeleteInventoryItem = async (inventoryId?: number) => {
    if (!inventoryId) {
      return;
    }

    const success = await desasignarInventario(inventoryId);
    if (success) {
      setSelectedInventoryId(null);
    }
  };

  const onOpenItemView = (item: TruckInventoryRow) => {
    setItemToView(item);
    if (typeof item.id === "number") {
      setSelectedInventoryId(item.id);
    }
    setIsViewItemDialogOpen(true);
  };

  const onOpenEditItem = (item: TruckInventoryRow) => {
    if (typeof item.id !== "number") {
      return;
    }

    setEditingItemId(item.id);
    setEditingInventoryForm(mapItemToInventoryForm(item));
    setSelectedInventoryId(item.id);
  };

  const onCancelInlineEdit = () => {
    setEditingItemId(null);
    setEditingInventoryForm(getInitialInventoryForm());
  };

  const onSaveInlineEdit = async (item: TruckInventoryRow) => {
    if (typeof item.id !== "number") {
      return;
    }

    if (!isInventoryFormValid(editingInventoryForm)) {
      return;
    }

    const deleted = await desasignarInventario(item.id);
    if (!deleted) {
      return;
    }

    const success = await asignarInventario(
      mapInventoryFormToPayload(editingInventoryForm),
    );
    if (!success) {
      return;
    }

    onCancelInlineEdit();
    setSelectedInventoryId(null);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">
          Inventario del camión {placa ?? "-"}
        </h1>

        <Button variant="outline" onClick={() => navigate("/intranet/trucks")}>
          <ArrowLeft className="h-4 w-4" />
          Regresar
        </Button>
      </div>

      <div className="mt-6 bg-white p-6 rounded-xl shadow-none border flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-800">Inventario</h2>
            <p className="text-sm text-muted-foreground">
              Ítems registrados: {inventario.length}. Stock crítico: {lowStockCount}.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setInventoryForm(getInitialInventoryForm());
                setIsAddItemDialogOpen(true);
              }}
              variant="outline"
              className="border-green-500 bg-white text-green-500 hover:border-green-500 hover:text-green-600 hover:bg-green-50"
              disabled={isLoading || hasInlineEditing}
            >
              Agregar ítem
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Table>
          <TableHeader className="[&_tr]:border-b border-gray-200">
            <TableRow className="hover:bg-white">
              <TableHead className="text-gray-500 font-medium">Objeto</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Cant. mínima</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Cant. actual</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Ubicación</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Requerido legal</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Cargando inventario...
                </TableCell>
              </TableRow>
            ) : inventario.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No hay ítems registrados para este camión.
                </TableCell>
              </TableRow>
            ) : (
              inventario.map((item, index) => {
                const rowId = item.id ?? index;
                const isLowStock = item.cantidad_actual < item.cantidad_requerida;
                const isSelected = selectedInventoryId === item.id;
                const isInlineEditingRow = editingItemId === item.id;
                const isAnotherRowBeingEdited =
                  hasInlineEditing && !isInlineEditingRow;
                const objectName =
                  item.detalle?.nombre_objeto?.trim() || `Objeto #${item.Id_Objeto}`;

                return (
                  <TableRow
                    key={rowId}
                    className={cn(
                      isLowStock && "bg-red-50 hover:bg-red-100",
                      isSelected && "ring-1 ring-primary/30",
                      isAnotherRowBeingEdited && "opacity-60",
                    )}
                    onClick={() => {
                      if (isAnotherRowBeingEdited) {
                        return;
                      }

                      if (typeof item.id === "number") {
                        setSelectedInventoryId(item.id);
                      }
                    }}
                  >
                    <TableCell className="font-medium">
                      {isInlineEditingRow ? (
                        <Input
                          type="number"
                          min={0}
                          value={editingInventoryForm.Id_Objeto}
                          onChange={(event) =>
                            setEditingInventoryForm((current) => ({
                              ...current,
                              Id_Objeto: event.target.value,
                            }))
                          }
                          className="h-9"
                          disabled={isLoading}
                        />
                      ) : (
                        <div className="flex flex-col">
                          <span>{objectName}</span>
                          <span className="text-xs text-muted-foreground">
                            ID {item.Id_Objeto}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isInlineEditingRow ? (
                        <Input
                          type="number"
                          min={0}
                          value={editingInventoryForm.cantidad_requerida}
                          onChange={(event) =>
                            setEditingInventoryForm((current) => ({
                              ...current,
                              cantidad_requerida: event.target.value,
                            }))
                          }
                          className="h-9 text-center"
                          disabled={isLoading}
                        />
                      ) : (
                        item.cantidad_requerida
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isInlineEditingRow ? (
                        <Input
                          type="number"
                          min={0}
                          value={editingInventoryForm.cantidad_actual}
                          onChange={(event) =>
                            setEditingInventoryForm((current) => ({
                              ...current,
                              cantidad_actual: event.target.value,
                            }))
                          }
                          className="h-9 text-center"
                          disabled={isLoading}
                        />
                      ) : (
                        item.cantidad_actual
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isInlineEditingRow ? (
                        <Input
                          value={editingInventoryForm.ubicacion_en_camion}
                          onChange={(event) =>
                            setEditingInventoryForm((current) => ({
                              ...current,
                              ubicacion_en_camion: event.target.value,
                            }))
                          }
                          className="h-9"
                          disabled={isLoading}
                        />
                      ) : (
                        item.ubicacion_en_camion
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isInlineEditingRow ? (
                        <Select
                          value={editingInventoryForm.requerido_legal}
                          onValueChange={(value: "si" | "no") =>
                            setEditingInventoryForm((current) => ({
                              ...current,
                              requerido_legal: value,
                            }))
                          }
                        >
                          <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="Requerido legal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="si">si</SelectItem>
                            <SelectItem value="no">no</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          className={cn(
                            "block mx-auto rounded-full px-3 py-1 text-[14px] font-medium border",
                            item.requerido_legal === "si"
                              ? "bg-green-200 text-green-600 border-green-400"
                              : "bg-red-200 text-red-600 border-red-400",
                          )}
                        >
                          {item.requerido_legal}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isInlineEditingRow ? (
                        <div className="flex justify-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-full aspect-square text-green-500 hover:border hover:border-green-500 hover:text-green-600 transition-colors hover:bg-green-50"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void onSaveInlineEdit(item);
                                }}
                                disabled={
                                  isLoading || !isInventoryFormValid(editingInventoryForm)
                                }
                                aria-label="Aceptar cambios"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-white border-[1.5px] border-green-500 text-green-500 font-normal text-center"
                              align="center"
                            >
                              Aceptar cambios
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-full aspect-square text-red-500 hover:border hover:border-red-500 hover:text-red-600 transition-colors hover:bg-red-50"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onCancelInlineEdit();
                                }}
                                disabled={isLoading}
                                aria-label="Cancelar edición"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-white border-[1.5px] border-red-500 text-red-500 font-normal text-center"
                              align="center"
                            >
                              Cancelar edición
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-full aspect-square text-amber-500 hover:border hover:border-amber-500 hover:text-amber-600 transition-colors hover:bg-amber-50"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onOpenEditItem(item);
                                }}
                                disabled={
                                  isLoading ||
                                  hasInlineEditing ||
                                  typeof item.id !== "number"
                                }
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-white border-[1.5px] border-amber-500 text-amber-500 font-normal text-center"
                              align="center"
                            >
                              Editar objeto
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-full aspect-square text-blue-500 hover:border hover:border-blue-500 hover:text-blue-600 transition-colors hover:bg-blue-50"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onOpenItemView(item);
                                }}
                                disabled={isLoading || hasInlineEditing}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-white border-[1.5px] border-blue-500 text-blue-500 font-normal text-center"
                              align="center"
                            >
                              Ver detalle de objeto
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-full aspect-square text-red-500 hover:border hover:border-red-500 hover:text-red-600 transition-colors hover:bg-red-50"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void onDeleteInventoryItem(item.id);
                                }}
                                disabled={isLoading || hasInlineEditing}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-white border-[1.5px] border-red-500 text-red-500 font-normal text-center"
                              align="center"
                            >
                              Eliminar ítem
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isAddItemDialogOpen}
        onOpenChange={(open) => {
          setIsAddItemDialogOpen(open);

          if (!open) {
            setInventoryForm(getInitialInventoryForm());
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl">Agregar ítem al camión</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para registrar un nuevo objeto en el inventario del camión.
            </p>
          </DialogHeader>

          <form onSubmit={onSubmitInventoryForm} className="grid gap-5">
            <div className="grid gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="new-item-id-objeto"
                  className="text-sm font-medium text-gray-700"
                >
                  ID del objeto
                </label>
                <Input
                  id="new-item-id-objeto"
                  type="number"
                  min={0}
                  value={inventoryForm.Id_Objeto}
                  onChange={(event) =>
                    setInventoryForm((current) => ({
                      ...current,
                      Id_Objeto: event.target.value,
                    }))
                  }
                  placeholder="Ej. 120"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="new-item-cantidad-requerida"
                  className="text-sm font-medium text-gray-700"
                >
                  Cantidad mínima
                </label>
                <Input
                  id="new-item-cantidad-requerida"
                  type="number"
                  min={0}
                  value={inventoryForm.cantidad_requerida}
                  onChange={(event) =>
                    setInventoryForm((current) => ({
                      ...current,
                      cantidad_requerida: event.target.value,
                    }))
                  }
                  placeholder="Ej. 5"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="new-item-cantidad-actual"
                  className="text-sm font-medium text-gray-700"
                >
                  Cantidad actual
                </label>
                <Input
                  id="new-item-cantidad-actual"
                  type="number"
                  min={0}
                  value={inventoryForm.cantidad_actual}
                  onChange={(event) =>
                    setInventoryForm((current) => ({
                      ...current,
                      cantidad_actual: event.target.value,
                    }))
                  }
                  placeholder="Ej. 3"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700" htmlFor="new-item-requerido-legal">
                  Requerido legal
                </label>
                <Select
                  value={inventoryForm.requerido_legal}
                  onValueChange={(value: "si" | "no") =>
                    setInventoryForm((current) => ({
                      ...current,
                      requerido_legal: value,
                    }))
                  }
                >
                  <SelectTrigger id="new-item-requerido-legal" className="w-full bg-white">
                    <SelectValue placeholder="Requerido legal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">si</SelectItem>
                    <SelectItem value="no">no</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="new-item-ubicacion"
                  className="text-sm font-medium text-gray-700"
                >
                  Ubicación en camión
                </label>
                <Input
                  id="new-item-ubicacion"
                  value={inventoryForm.ubicacion_en_camion}
                  onChange={(event) =>
                    setInventoryForm((current) => ({
                      ...current,
                      ubicacion_en_camion: event.target.value,
                    }))
                  }
                  placeholder="Ej. Compartimento lateral izquierdo"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddItemDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
                disabled={isLoading || !isCreateFormValid}
              >
                Guardar ítem
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewItemDialogOpen} onOpenChange={setIsViewItemDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Ficha del objeto</DialogTitle>
          </DialogHeader>

          {itemToView ? (
            <div className="grid gap-4 text-sm">
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {objectName}
                    </p>
                  </div>
                  <Badge variant="outline">ID {itemToView.Id_Objeto}</Badge>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {itemDetalle ? (
                    <>
                      <div className="rounded-md border border-gray-200 bg-gray-50/50 p-3">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Identificación
                        </p>
                        <div className="grid gap-2">
                          {renderDetailPairs([
                            ["Nombre del objeto", itemDetalle.nombre_objeto],
                            ["Número de serie", itemDetalle.numero_serial],
                            ["Estado", itemDetalle.estado],
                            ["Año de fabricación", itemDetalle.ano_fabricacion],
                            ["Peso", itemDetalle.peso],
                            ["Cantidad", itemDetalle.cantidad],
                            ["Lugar de almacenaje", itemDetalle.lugar_almacenaje],
                            ["Nombre del fabricante", itemDetalle.Fabricante_Nombre],
                            ["Fabricante ID", itemDetalle.ID_Fabricante],
                          ])}
                        </div>
                      </div>

                      <div className="rounded-md border border-gray-200 bg-gray-50/50 p-3">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Compra y Documentos
                        </p>
                        <div className="grid gap-2">
                          {renderDetailPairs([
                            ["Orden de compra", itemDetalle.orden_compra],
                            ["Fecha de compra", formatDate(itemDetalle.fecha_compra)],
                            ["Factura", itemDetalle.factura],
                            ["Garantía", itemDetalle.garantia],
                          ])}
                        </div>
                      </div>

                      <div className="rounded-md border border-gray-200 bg-gray-50/50 p-3">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Costos y Envío
                        </p>
                        <div className="grid gap-2">
                          {renderDetailPairs([
                            ["Precio de compra", itemDetalle.precio_compra],
                            ["Precio de envío", itemDetalle.precio_envio],
                            ["Precio comercial", itemDetalle.precio_comercial],
                            ["Responsable de envío", itemDetalle.responsable_envio],
                          ])}
                        </div>
                      </div>

                      <div className="rounded-md border border-gray-200 bg-gray-50/50 p-3">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Mantenimiento
                        </p>
                        <div className="grid gap-2">
                          {renderDetailPairs([
                            ["Mantenimiento requerido", itemDetalle.mant_requerimiento],
                            [
                              "Último mantenimiento",
                              itemDetalle.mant_ultimo ? formatDate(itemDetalle.mant_ultimo) : "-",
                            ],
                            [
                              "Caducidad de mantenimiento",
                              formatDate(itemDetalle.mant_fecha_caducidad),
                            ],
                            ["Responsable de mantenimiento", itemDetalle.mant_responsable],
                            ["Contacto de mantenimiento", itemDetalle.mant_contacto],
                          ])}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground lg:col-span-2">
                      No se pudo cargar el detalle completo del objeto.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No se encontró información del ítem.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TruckInventoryPage;
