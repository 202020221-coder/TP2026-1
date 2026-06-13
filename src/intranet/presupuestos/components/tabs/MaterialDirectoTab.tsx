import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { inventoryApi } from "@/intranet/inventory/api/inventory.api";
import type { InventarioItem } from "@/intranet/inventory/interfaces/inventory.interface";
import {
  usePresupuestoItems,
  useAddPresupuestoItem,
  useUpdatePresupuestoItem,
} from "../../hooks/usePresupuestos";
import type { PresupuestoItem, RealizacionGastos, Moneda, Estancia } from "../../interfaces/presupuesto";

const TIPO = "Material Directo" as const;

interface Props { cotizacionId: number; }

type FormData = {
  nombre_gasto: string;
  costo_unitario: number;
  cantidad: number;
  realizacion_gastos: RealizacionGastos;
  moneda: Moneda;
  estancia: Estancia;
};

const DEFAULT_VALUES = {
  realizacion_gastos: "en preparacion" as RealizacionGastos,
  moneda: "soles" as Moneda,
  estancia: "para proyecto" as Estancia,
};

function ItemForm({
  onSubmit,
  isPending,
  submitLabel,
  control,
  register,
  setValue,
  errors,
  total,
}: {
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
  control: ReturnType<typeof useForm<FormData>>["control"];
  register: ReturnType<typeof useForm<FormData>>["register"];
  setValue: ReturnType<typeof useForm<FormData>>["setValue"];
  errors: ReturnType<typeof useForm<FormData>>["formState"]["errors"];
  total: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const nombreValue = useWatch({ control, name: "nombre_gasto" });

  const { data: inventarioData, isLoading: loadingInventario } = useQuery({
    queryKey: ["inventario", "presupuesto-material-search"],
    queryFn: () => inventoryApi.getAll(1, 500),
    staleTime: 5 * 60 * 1000,
  });

  const inventoryItems = inventarioData?.data ?? [];

  useEffect(() => {
    setSearchTerm(nombreValue ?? "");
  }, [nombreValue]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return [];
    }

    return inventoryItems
      .filter((item) => {
        const haystack = [
          item.nombre_objeto,
          String(item.Id_Objeto),
          item.Fabricante_Nombre ?? "",
          item.numero_serial ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      })
      .slice(0, 8);
  }, [inventoryItems, searchTerm]);

  const handleSelectItem = (item: InventarioItem) => {
    const nombre = item.nombre_objeto;
    const precio = Number(item.precio_comercial ?? 0);

    setValue("nombre_gasto", nombre, { shouldValidate: true, shouldDirty: true });
    setValue("costo_unitario", precio, { shouldValidate: true, shouldDirty: true });
    setSearchTerm(nombre);
    setIsDropdownOpen(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Nombre *</label>
        <Controller
          name="nombre_gasto"
          control={control}
          rules={{ required: "El nombre es requerido" }}
          render={({ field }) => (
            <div className="relative mt-1">
              <Input
                placeholder="Buscar en inventario o escribir nombre..."
                value={searchTerm}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearchTerm(value);
                  field.onChange(value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setIsDropdownOpen(false)}
                autoComplete="off"
              />

              {isDropdownOpen &&
              (searchTerm.trim().length > 0 || loadingInventario) ? (
                <div
                  className="absolute z-50 mt-1 w-full rounded-md border bg-card shadow-md"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <div className="max-h-56 overflow-auto">
                    {loadingInventario ? (
                      <div className="space-y-2 px-3 py-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    ) : filteredItems.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Sin resultados en inventario.
                      </div>
                    ) : (
                      filteredItems.map((item) => (
                        <button
                          key={item.Id_Objeto}
                          type="button"
                          className="flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm hover:bg-muted/60"
                          onClick={() => handleSelectItem(item)}
                        >
                          <span className="font-medium text-foreground">
                            {item.nombre_objeto}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ID {item.Id_Objeto}
                            {item.precio_comercial != null
                              ? ` · S/. ${Number(item.precio_comercial).toFixed(2)}`
                              : ""}
                            {item.Fabricante_Nombre
                              ? ` · ${item.Fabricante_Nombre}`
                              : ""}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        />
        {errors.nombre_gasto && <p className="text-sm text-destructive mt-1">{errors.nombre_gasto.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Costo Unitario (S/.) *</label>
          <Input type="number" step="0.01" min="0" placeholder="Ej: 18.00"
            {...register("costo_unitario", { required: "Requerido" })} className="mt-1" />
          {errors.costo_unitario && <p className="text-sm text-destructive mt-1">{errors.costo_unitario.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Cantidad *</label>
          <Input type="number" min="1" placeholder="Ej: 120"
            {...register("cantidad", { required: "Requerido" })} className="mt-1" />
          {errors.cantidad && <p className="text-sm text-destructive mt-1">{errors.cantidad.message}</p>}
        </div>
      </div>
      <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
        Total estimado: <span className="font-semibold">S/. {total}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium">Moneda *</label>
          <Controller name="moneda" control={control} rules={{ required: "Requerido" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="soles">Soles</SelectItem>
                  <SelectItem value="dolares">Dólares</SelectItem>
                </SelectContent>
              </Select>
            )} />
        </div>
        <div>
          <label className="text-sm font-medium">Destino *</label>
          <Controller name="estancia" control={control} rules={{ required: "Requerido" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="para proyecto">Para Proyecto</SelectItem>
                  <SelectItem value="para inventario">Para Inventario</SelectItem>
                </SelectContent>
              </Select>
            )} />
        </div>
        <div>
          <label className="text-sm font-medium">Realización *</label>
          <Controller name="realizacion_gastos" control={control} rules={{ required: "Requerido" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en preparacion">En preparación</SelectItem>
                  <SelectItem value="durante servicio">Durante servicio</SelectItem>
                  <SelectItem value="anulada">Anulada</SelectItem>
                </SelectContent>
              </Select>
            )} />
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}

export function MaterialDirectoTab({ cotizacionId }: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PresupuestoItem | null>(null);

  const { data: items, isLoading } = usePresupuestoItems(cotizacionId, TIPO);
  const { mutate: add, isPending: isAdding } = useAddPresupuestoItem(TIPO);
  const { mutate: update, isPending: isUpdating } = useUpdatePresupuestoItem(cotizacionId, TIPO);

  const addForm = useForm<FormData>({ defaultValues: DEFAULT_VALUES });
  const editForm = useForm<FormData>({ defaultValues: DEFAULT_VALUES });

  const addTotal = ((Number(addForm.watch("costo_unitario")) || 0) * (Number(addForm.watch("cantidad")) || 0)).toFixed(2);
  const editTotal = ((Number(editForm.watch("costo_unitario")) || 0) * (Number(editForm.watch("cantidad")) || 0)).toFixed(2);

  const onAdd = addForm.handleSubmit((data) => {
    add(
      { cotizacionId, payload: { tipo: TIPO, nombre_gasto: data.nombre_gasto, costo_unitario: String(data.costo_unitario), cantidad: String(data.cantidad), costo_total: addTotal, realizacion_gastos: data.realizacion_gastos, moneda: data.moneda, estancia: data.estancia } },
      { onSettled: () => { setIsAddOpen(false); addForm.reset(DEFAULT_VALUES); } }
    );
  });

  const openEdit = (item: PresupuestoItem) => {
    setEditingItem(item);
    editForm.reset({
      nombre_gasto: item.nombre_gasto,
      costo_unitario: parseFloat(item.costo_unitario || "0"),
      cantidad: parseFloat(item.cantidad || "0"),
      realizacion_gastos: item.realizacion_gastos,
      moneda: item.moneda,
      estancia: item.estancia ?? "para proyecto",
    });
  };

  const onEdit = editForm.handleSubmit((data) => {
    if (!editingItem) return;
    update(
      { itemId: editingItem.ID, payload: { nombre_gasto: data.nombre_gasto, costo_unitario: String(data.costo_unitario), cantidad: String(data.cantidad), costo_total: editTotal, realizacion_gastos: data.realizacion_gastos, moneda: data.moneda, estancia: data.estancia } },
      { onSettled: () => setEditingItem(null) }
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Nuevo Material</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Agregar Material Directo</DialogTitle></DialogHeader>
            <ItemForm onSubmit={onAdd} isPending={isAdding} submitLabel="Agregar Material"
              control={addForm.control} register={addForm.register} setValue={addForm.setValue}
              errors={addForm.formState.errors} total={addTotal} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Editar Material Directo</DialogTitle></DialogHeader>
          <ItemForm onSubmit={onEdit} isPending={isUpdating} submitLabel="Guardar Cambios"
            control={editForm.control} register={editForm.register} setValue={editForm.setValue}
            errors={editForm.formState.errors} total={editTotal} />
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold w-14">ID</TableHead>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold text-right">Costo Unit.</TableHead>
              <TableHead className="font-semibold text-right">Cant.</TableHead>
              <TableHead className="font-semibold text-right">Total (S/.)</TableHead>
              <TableHead className="font-semibold">Moneda</TableHead>
              <TableHead className="font-semibold">Destino</TableHead>
              <TableHead className="font-semibold">Realización</TableHead>
              <TableHead className="font-semibold text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /><span>Cargando...</span></div>
                </TableCell>
              </TableRow>
            ) : !items || items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Sin materiales directos registrados</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.ID}>
                  <TableCell className="text-muted-foreground">{item.ID}</TableCell>
                  <TableCell className="font-medium">{item.nombre_gasto}</TableCell>
                  <TableCell className="text-right">{item.costo_unitario ? parseFloat(item.costo_unitario).toFixed(2) : "—"}</TableCell>
                  <TableCell className="text-right">{item.cantidad ?? "—"}</TableCell>
                  <TableCell className="text-right">{parseFloat(item.costo_total).toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{item.moneda ?? "—"}</TableCell>
                  <TableCell>{item.estancia ?? "—"}</TableCell>
                  <TableCell className="text-sm">{item.realizacion_gastos ?? "—"}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(item)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
