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
import type { RealizacionGastos, Moneda, Estancia } from "../../interfaces/presupuesto";

const TIPO = "Material Directo" as const;

interface Props {
  cotizacionId: number;
}

type FormData = {
  nombre_gasto: string;
  costo_unitario: number;
  cantidad: number;
  realizacion_gastos: RealizacionGastos;
  moneda: Moneda;
  estancia: Estancia;
};

export function MaterialDirectoTab({ cotizacionId }: Props) {
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
        estancia: "para proyecto",
      },
    });

  const costoUnitario = watch("costo_unitario");
  const cantidad = watch("cantidad");
  const total = ((Number(costoUnitario) || 0) * (Number(cantidad) || 0)).toFixed(2);

  const onSubmit = (data: FormData) => {
    add(
      {
        cotizacionId,
        payload: {
          tipo: TIPO,
          nombre_gasto: data.nombre_gasto,
          costo_unitario: String(data.costo_unitario),
          cantidad: String(data.cantidad),
          costo_total: total,
          realizacion_gastos: data.realizacion_gastos,
          moneda: data.moneda,
          estancia: data.estancia,
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
              Nuevo Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar Material Directo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre *</label>
                <Input
                  placeholder="Ej: Rociadores sprinkler x120"
                  {...register("nombre_gasto", { required: "El nombre es requerido" })}
                  className="mt-1"
                />
                {errors.nombre_gasto && (
                  <p className="text-sm text-destructive mt-1">{errors.nombre_gasto.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Costo Unitario (S/.) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej: 18.00"
                    {...register("costo_unitario", { required: "Requerido" })}
                    className="mt-1"
                  />
                  {errors.costo_unitario && (
                    <p className="text-sm text-destructive mt-1">{errors.costo_unitario.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Cantidad *</label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Ej: 120"
                    {...register("cantidad", { required: "Requerido" })}
                    className="mt-1"
                  />
                  {errors.cantidad && (
                    <p className="text-sm text-destructive mt-1">{errors.cantidad.message}</p>
                  )}
                </div>
              </div>

              <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                Total estimado: <span className="font-semibold">S/. {total}</span>
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
                  <label className="text-sm font-medium">Destino *</label>
                  <Controller
                    name="estancia"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="para proyecto">Para Proyecto</SelectItem>
                          <SelectItem value="para inventario">Para Inventario</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
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

              <Button type="submit" disabled={isAdding} className="w-full">
                {isAdding ? "Agregando..." : "Agregar Material"}
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
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold text-right">Costo Unit.</TableHead>
              <TableHead className="font-semibold text-right">Cant.</TableHead>
              <TableHead className="font-semibold text-right">Total (S/.)</TableHead>
              <TableHead className="font-semibold text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !items || items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Sin materiales directos registrados
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.ID}>
                  <TableCell className="text-muted-foreground">{item.ID}</TableCell>
                  <TableCell className="font-medium">{item.nombre_gasto}</TableCell>
                  <TableCell className="text-right">
                    {item.costo_unitario ? parseFloat(item.costo_unitario).toFixed(2) : "—"}
                  </TableCell>
                  <TableCell className="text-right">{item.cantidad ?? "—"}</TableCell>
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
