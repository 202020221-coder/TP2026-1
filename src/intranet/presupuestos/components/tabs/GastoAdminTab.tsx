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

const TIPO = "Gastos Administrativos" as const;

interface Props {
  cotizacionId: number;
}

type FormData = {
  nombre_gasto: string;
  costo_total: number;
  realizacion_gastos: RealizacionGastos;
  moneda: Moneda;
};

export function GastoAdminTab({ cotizacionId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { data: items, isLoading } = usePresupuestoItems(cotizacionId, TIPO);
  const { mutate: add, isPending: isAdding } = useAddPresupuestoItem(TIPO);
  const { mutate: remove, isPending: isRemoving } = useDeletePresupuestoItem(cotizacionId, TIPO);

  const { register, handleSubmit, reset, control, formState: { errors } } =
    useForm<FormData>({
      defaultValues: {
        realizacion_gastos: "en preparacion",
        moneda: "soles",
      },
    });

  const onSubmit = (data: FormData) => {
    add(
      {
        cotizacionId,
        payload: {
          tipo: TIPO,
          nombre_gasto: data.nombre_gasto,
          costo_total: String(data.costo_total),
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
              Nuevo Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar Gasto Administrativo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Razón del Gasto *</label>
                <Input
                  placeholder="Ej: Transporte y combustible"
                  {...register("nombre_gasto", { required: "La razón es requerida" })}
                  className="mt-1"
                />
                {errors.nombre_gasto && (
                  <p className="text-sm text-destructive mt-1">{errors.nombre_gasto.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Total (S/.) *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 3200.00"
                  {...register("costo_total", { required: "El costo es requerido" })}
                  className="mt-1"
                />
                {errors.costo_total && (
                  <p className="text-sm text-destructive mt-1">{errors.costo_total.message}</p>
                )}
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
                {isAdding ? "Agregando..." : "Agregar Gasto"}
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
              <TableHead className="font-semibold">Razón del Gasto</TableHead>
              <TableHead className="font-semibold">Realización</TableHead>
              <TableHead className="font-semibold text-right">Total (S/.)</TableHead>
              <TableHead className="font-semibold text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !items || items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Sin gastos administrativos registrados
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.ID}>
                  <TableCell className="text-muted-foreground">{item.ID}</TableCell>
                  <TableCell className="font-medium">{item.nombre_gasto}</TableCell>
                  <TableCell className="text-sm text-muted-foreground capitalize">
                    {item.realizacion_gastos}
                  </TableCell>
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
