import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  useManoObra,
  useAddManoObra,
  useDeleteManoObra,
} from "../../hooks/usePresupuestos";

interface Props {
  presupuestoId: number;
}

type FormData = {
  profesion_ejercida: string;
  costo_x_hora: number;
  costo_general: number;
};

export function ManoObraTab({ presupuestoId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { data: items, isLoading } = useManoObra(presupuestoId);
  const { mutate: add, isPending: isAdding } = useAddManoObra();
  const { mutate: remove, isPending: isRemoving } = useDeleteManoObra();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: { profesion_ejercida: "" },
  });

  const onSubmit = (data: FormData) => {
    add(
      {
        presupuestoId,
        payload: {
          profesion_ejercida: data.profesion_ejercida,
          costo_x_hora: Number(data.costo_x_hora),
          costo_general: Number(data.costo_general),
        },
      },
      { onSettled: () => { setIsOpen(false); reset(); } }
    );
  };

  const handleDelete = (id: number) => {
    remove({ presupuestoId, sid: id }, { onSettled: () => setConfirmId(null) });
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Mano de Obra</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Profesión ejercida *</label>
                <Input
                  placeholder="Ej: Supervisor de Proyecto"
                  {...register("profesion_ejercida", { required: "La profesión es requerida" })}
                  className="mt-1"
                />
                {errors.profesion_ejercida && (
                  <p className="text-sm text-destructive mt-1">{errors.profesion_ejercida.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Costo x Hora (S/.) *</label>
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
                  <label className="text-sm font-medium">Total (S/.) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej: 12600.00"
                    {...register("costo_general", { required: "Requerido" })}
                    className="mt-1"
                  />
                  {errors.costo_general && (
                    <p className="text-sm text-destructive mt-1">{errors.costo_general.message}</p>
                  )}
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
              <TableHead className="font-semibold">Profesión Ejercida</TableHead>
              <TableHead className="font-semibold text-right">Costo x Hora</TableHead>
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
                  Sin mano de obra registrada
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.profesion_ejercida}</TableCell>
                  <TableCell className="text-right">{parseFloat(item.costo_x_hora).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{parseFloat(item.costo_general).toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {confirmId === item.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-muted-foreground">¿Eliminar?</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isRemoving}
                          onClick={() => handleDelete(item.id)}
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
                        onClick={() => setConfirmId(item.id)}
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
