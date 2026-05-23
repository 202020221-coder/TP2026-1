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
  useMaterialDirecto,
  useAddMaterialDirecto,
  useDeleteMaterialDirecto,
} from "../../hooks/usePresupuestos";

interface Props {
  presupuestoId: number;
}

type FormData = { nombre: string; costo: number };

export function MaterialDirectoTab({ presupuestoId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { data: items, isLoading } = useMaterialDirecto(presupuestoId);
  const { mutate: add, isPending: isAdding } = useAddMaterialDirecto();
  const { mutate: remove, isPending: isRemoving } = useDeleteMaterialDirecto();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: { nombre: "" },
  });

  const onSubmit = (data: FormData) => {
    add(
      { presupuestoId, payload: { nombre: data.nombre, costo: Number(data.costo) } },
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
              Nuevo Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Material Directo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre *</label>
                <Input
                  placeholder="Ej: Rociadores sprinkler x120"
                  {...register("nombre", { required: "El nombre es requerido" })}
                  className="mt-1"
                />
                {errors.nombre && (
                  <p className="text-sm text-destructive mt-1">{errors.nombre.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Costo (S/.) *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 2160.00"
                  {...register("costo", { required: "El costo es requerido", min: 0 })}
                  className="mt-1"
                />
                {errors.costo && (
                  <p className="text-sm text-destructive mt-1">{errors.costo.message}</p>
                )}
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
              <TableHead className="font-semibold text-right">Costo (S/.)</TableHead>
              <TableHead className="font-semibold text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !items || items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Sin materiales directos registrados
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.nombre}</TableCell>
                  <TableCell className="text-right">{parseFloat(item.costo).toFixed(2)}</TableCell>
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
