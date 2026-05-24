import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  usePresupuestoItems,
  useAddPresupuestoItem,
  useDeletePresupuestoItem,
} from "../../hooks/usePresupuestos";
import type { RealizacionGastos, Moneda } from "../../interfaces/presupuesto";

const TIPO = "Mano de Obra" as const;

interface Props {
  cotizacionId: number;
}

type FormData = {
  nombre_gasto: string;
  costo_x_hora: number;
  hora_total: number;
  dias_trabajados: number;
  realizacion_gastos: RealizacionGastos;
  moneda: Moneda;
};

export function ManoObraTab({ cotizacionId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { data: items, isLoading } = usePresupuestoItems(cotizacionId, TIPO);
  const { mutate: add, isPending: isAdding } = useAddPresupuestoItem(TIPO);
  const { mutate: remove, isPending: isRemoving } = useDeletePresupuestoItem(cotizacionId, TIPO);

  const { register, handleSubmit, reset, watch, control, formState: { errors } } =
    useForm<FormData>({
      defaultValues: {
        realizacion_gastos: "en preparacion",
        moneda: "soles",
      },
    });

  const costoXHora = watch("costo_x_hora");
  const horaTotal = watch("hora_total");
  const diasTrabajados = watch("dias_trabajados");
  const total = (
    (Number(costoXHora) || 0) *
    (Number(horaTotal) || 0) *
    (Number(diasTrabajados) || 0)
  ).toFixed(2);

  const onSubmit = (data: FormData) => {
    add(
      {
        cotizacionId,
        payload: {
          tipo: TIPO,
          nombre_gasto: data.nombre_gasto,
          costo_x_hora: String(data.costo_x_hora),
          hora_total: String(data.hora_total),
          dias_trabajados: Number(data.dias_trabajados),
          costo_total: total,
          realizacion_gastos: data.realizacion_gastos,
          moneda: data.moneda,
        },
      },
      { onSettled: () => { setIsOpen(false); reset(); } }
    );
  };

  const handleDelete = (id: number) => {
    remove(id, { onSettled: () => setConfirmId(null) });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Mano de Obra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar Mano de Obra</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Profesión ejercida *</label>
                <Input
                  placeholder="Ej: Supervisor de Proyecto"
                  {...register("nombre_gasto", { required: "La profesión es requerida" })}
                  className="mt-1"
                />
                {errors.nombre_gasto && (
                  <p className="text-sm text-destructive mt-1">{errors.nombre_gasto.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">S/. x Hora *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej: 45.00"
                    {...register("costo_x_hora", { required: "Requerido" })}
                    className="mt-1"
                  />
                  {errors.costo_x_hora && (
                    <p className="text-sm text-destructive mt-1">{errors.costo_x_hora.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Horas *</label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="Ej: 8"
                    {...register("hora_total", { required: "Requerido" })}
                    className="mt-1"
                  />
                  {errors.hora_total && (
                    <p className="text-sm text-destructive mt-1">{errors.hora_total.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Días *</label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Ej: 30"
                    {...register("dias_trabajados", { required: "Requerido" })}
                    className="mt-1"
                  />
                  {errors.dias_trabajados && (
                    <p className="text-sm text-destructive mt-1">{errors.dias_trabajados.message}</p>
                  )}
                </div>
              </div>

              <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                Total estimado: <span className="font-semibold">S/. {total}</span>
                <span className="text-muted-foreground ml-2">(S/. x Hora × Horas × Días)</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Moneda *</label>
                  <Controller
                    name="moneda"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soles">Soles</SelectItem>
                          <SelectItem value="dolares">Dólares</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Realización *</label>
                  <Controller
                    name="realizacion_gastos"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en preparacion">En preparación</SelectItem>
                          <SelectItem value="durante servicio">Durante servicio</SelectItem>
                          <SelectItem value="anulada">Anulada</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isAdding} className="w-full">
                {isAdding ? "Agregando..." : "Agregar Mano de Obra"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold w-16">ID</TableHead>
              <TableHead className="font-semibold">Profesión</TableHead>
              <TableHead className="font-semibold text-right">S/. x Hora</TableHead>
              <TableHead className="font-semibold text-right">Horas</TableHead>
              <TableHead className="font-semibold text-right">Días</TableHead>
              <TableHead className="font-semibold text-right">Total (S/.)</TableHead>
              <TableHead className="font-semibold text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !items || items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Sin mano de obra registrada
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.ID}>
                  <TableCell className="text-muted-foreground">{item.ID}</TableCell>
                  <TableCell className="font-medium">{item.nombre_gasto}</TableCell>
                  <TableCell className="text-right">
                    {item.costo_x_hora ? parseFloat(item.costo_x_hora).toFixed(2) : "—"}
                  </TableCell>
                  <TableCell className="text-right">{item.hora_total ?? "—"}</TableCell>
                  <TableCell className="text-right">{item.dias_trabajados ?? "—"}</TableCell>
                  <TableCell className="text-right">{parseFloat(item.costo_total).toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {confirmId === item.ID ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-muted-foreground">¿Eliminar?</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isRemoving}
                          onClick={() => handleDelete(item.ID)}
                          className="h-7 px-2 text-xs"
                        >
                          Sí
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmId(null)}
                          className="h-7 px-2 text-xs"
                        >
                          No
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmId(item.ID)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
