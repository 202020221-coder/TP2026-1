import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { Plus, Pencil, Loader2 } from "lucide-react";
import {
  usePresupuestoItems,
  useAddPresupuestoItem,
  useUpdatePresupuestoItem,
} from "../../hooks/usePresupuestos";
import type { PresupuestoItem, RealizacionGastos, Moneda } from "../../interfaces/presupuesto";

const TIPO = "Mano de Obra" as const;

interface Props { cotizacionId: number; }

type FormData = {
  nombre_gasto: string;
  costo_x_hora: number;
  hora_total: number;
  dias_trabajados: number;
  realizacion_gastos: RealizacionGastos;
  moneda: Moneda;
};

const DEFAULT_VALUES = {
  realizacion_gastos: "en preparacion" as RealizacionGastos,
  moneda: "soles" as Moneda,
};

function ItemForm({
  onSubmit, isPending, submitLabel, control, register, errors, total,
}: {
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
  control: ReturnType<typeof useForm<FormData>>["control"];
  register: ReturnType<typeof useForm<FormData>>["register"];
  errors: ReturnType<typeof useForm<FormData>>["formState"]["errors"];
  total: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Profesión ejercida *</label>
        <Input placeholder="Ej: Supervisor de Proyecto"
          {...register("nombre_gasto", { required: "La profesión es requerida" })} className="mt-1" />
        {errors.nombre_gasto && <p className="text-sm text-destructive mt-1">{errors.nombre_gasto.message}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium">S/. x Hora *</label>
          <Input type="number" step="0.01" min="0" placeholder="Ej: 45.00"
            {...register("costo_x_hora", { required: "Requerido" })} className="mt-1" />
          {errors.costo_x_hora && <p className="text-sm text-destructive mt-1">{errors.costo_x_hora.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Horas *</label>
          <Input type="number" step="0.5" min="0" placeholder="Ej: 8"
            {...register("hora_total", { required: "Requerido" })} className="mt-1" />
          {errors.hora_total && <p className="text-sm text-destructive mt-1">{errors.hora_total.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Días *</label>
          <Input type="number" min="1" placeholder="Ej: 30"
            {...register("dias_trabajados", { required: "Requerido" })} className="mt-1" />
          {errors.dias_trabajados && <p className="text-sm text-destructive mt-1">{errors.dias_trabajados.message}</p>}
        </div>
      </div>
      <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
        Total estimado: <span className="font-semibold">S/. {total}</span>
        <span className="text-muted-foreground ml-2">(S/. x Hora × Horas × Días)</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
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

export function ManoObraTab({ cotizacionId }: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PresupuestoItem | null>(null);

  const { data: items, isLoading } = usePresupuestoItems(cotizacionId, TIPO);
  const { mutate: add, isPending: isAdding } = useAddPresupuestoItem(TIPO);
  const { mutate: update, isPending: isUpdating } = useUpdatePresupuestoItem(cotizacionId, TIPO);

  const addForm = useForm<FormData>({ defaultValues: DEFAULT_VALUES });
  const editForm = useForm<FormData>({ defaultValues: DEFAULT_VALUES });

  const calcTotal = (f: typeof addForm) =>
    ((Number(f.watch("costo_x_hora")) || 0) * (Number(f.watch("hora_total")) || 0) * (Number(f.watch("dias_trabajados")) || 0)).toFixed(2);

  const addTotal = calcTotal(addForm);
  const editTotal = calcTotal(editForm);

  const onAdd = addForm.handleSubmit((data) => {
    add(
      { cotizacionId, payload: { tipo: TIPO, nombre_gasto: data.nombre_gasto, costo_x_hora: String(data.costo_x_hora), hora_total: String(data.hora_total), dias_trabajados: Number(data.dias_trabajados), costo_total: addTotal, realizacion_gastos: data.realizacion_gastos, moneda: data.moneda } },
      { onSettled: () => { setIsAddOpen(false); addForm.reset(DEFAULT_VALUES); } }
    );
  });

  const openEdit = (item: PresupuestoItem) => {
    setEditingItem(item);
    editForm.reset({
      nombre_gasto: item.nombre_gasto,
      costo_x_hora: parseFloat(item.costo_x_hora || "0"),
      hora_total: parseFloat(item.hora_total || "0"),
      dias_trabajados: item.dias_trabajados ?? 0,
      realizacion_gastos: item.realizacion_gastos,
      moneda: item.moneda,
    });
  };

  const onEdit = editForm.handleSubmit((data) => {
    if (!editingItem) return;
    update(
      { itemId: editingItem.ID, payload: { nombre_gasto: data.nombre_gasto, costo_x_hora: String(data.costo_x_hora), hora_total: String(data.hora_total), dias_trabajados: Number(data.dias_trabajados), costo_total: editTotal, realizacion_gastos: data.realizacion_gastos, moneda: data.moneda } },
      { onSettled: () => setEditingItem(null) }
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Nueva Mano de Obra</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Agregar Mano de Obra</DialogTitle></DialogHeader>
            <ItemForm onSubmit={onAdd} isPending={isAdding} submitLabel="Agregar Mano de Obra"
              control={addForm.control} register={addForm.register} errors={addForm.formState.errors} total={addTotal} />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Editar Mano de Obra</DialogTitle></DialogHeader>
          <ItemForm onSubmit={onEdit} isPending={isUpdating} submitLabel="Guardar Cambios"
            control={editForm.control} register={editForm.register} errors={editForm.formState.errors} total={editTotal} />
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold w-14">ID</TableHead>
              <TableHead className="font-semibold">Profesión</TableHead>
              <TableHead className="font-semibold text-right">S/. x Hora</TableHead>
              <TableHead className="font-semibold text-right">Horas</TableHead>
              <TableHead className="font-semibold text-right">Días</TableHead>
              <TableHead className="font-semibold text-right">Total (S/.)</TableHead>
              <TableHead className="font-semibold">Moneda</TableHead>
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
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Sin mano de obra registrada</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.ID}>
                  <TableCell className="text-muted-foreground">{item.ID}</TableCell>
                  <TableCell className="font-medium">{item.nombre_gasto}</TableCell>
                  <TableCell className="text-right">{item.costo_x_hora ? parseFloat(item.costo_x_hora).toFixed(2) : "—"}</TableCell>
                  <TableCell className="text-right">{item.hora_total ?? "—"}</TableCell>
                  <TableCell className="text-right">{item.dias_trabajados ?? "—"}</TableCell>
                  <TableCell className="text-right">{parseFloat(item.costo_total).toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{item.moneda ?? "—"}</TableCell>
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
