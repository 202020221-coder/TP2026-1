import { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  useAddInventarioToProyecto,
  useRemoveInventarioFromProyecto,
  useInventarioList,
  useInventarioDelProyecto,
} from "../hooks/useOrganizarRecursos";
import { formatDate } from "@/shared/lib/utils";
import { ORGANIZAR_RECURSOS_DEFAULTS } from "../lib/constants";

interface InventarioSectionProps {
  projectId: number;
}

export function InventarioSection({ projectId }: InventarioSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Catálogo general de objetos disponibles en la BD
  const { data: inventarioDisponible, isLoading: loadingCatalogo } = useInventarioList();
  // Inventario asignado al proyecto (incluye Id_Objeto para eliminar)
  const { data: inventarioAsignado, isLoading: loadingAsignado } =
    useInventarioDelProyecto(projectId);

  const { mutate: addInventario, isPending: isAddingInventario } =
    useAddInventarioToProyecto();
  const { mutate: removeInventario, isPending: isRemovingInventario } =
    useRemoveInventarioFromProyecto();

  const today = new Date().toISOString().split("T")[0];
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      objeto: "",
      cantidad: 1,
      fecha_salida: today,
      fecha_retorno: today,
      metodo_traslado: "camión",
      estado: "aceptable",
    },
  });

  const objetoSeleccionado = watch("objeto");

  const productoInfo = useMemo(() => {
    if (!objetoSeleccionado || !inventarioDisponible) return null;
    return inventarioDisponible.data.find(
      (item) => item.Id_Objeto.toString() === objetoSeleccionado
    );
  }, [objetoSeleccionado, inventarioDisponible]);

  const onSubmit = (data: any) => {
    if (!productoInfo) return;

    addInventario(
      {
        projectId,
        payload: {
          Id_Objeto: parseInt(data.objeto),
          cantidad_objeto: parseInt(data.cantidad),
          estado_post: data.estado,
          fecha_salida: data.fecha_salida,
          fecha_retorno: data.fecha_retorno,
          metodo_traslado: data.metodo_traslado,
        },
      },
      {
        onSettled: () => {
          setIsOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Objetos / Equipos</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Objeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar Objeto al Proyecto</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Objeto *</label>
                <Select
                  onValueChange={(value) => setValue("objeto", value)}
                  value={watch("objeto")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar objeto..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {loadingCatalogo ? (
                      <div className="flex items-center justify-center py-4 gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Cargando objetos...</span>
                      </div>
                    ) : inventarioDisponible?.data ? (
                      inventarioDisponible.data.map((item) => (
                        <SelectItem
                          key={item.Id_Objeto}
                          value={item.Id_Objeto.toString()}
                        >
                          {item.nombre_objeto} (Disponible: {item.cantidad})
                        </SelectItem>
                      ))
                    ) : null}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Cantidad *</label>
                <Input
                  type="number"
                  min="1"
                  max={productoInfo?.cantidad || 1}
                  {...register("cantidad", {
                    required: "La cantidad es requerida",
                    min: 1,
                  })}
                  className="mt-1"
                />
                {errors.cantidad && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.cantidad.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Fecha Salida *</label>
                  <Input
                    type="date"
                    {...register("fecha_salida", { required: "Requerida" })}
                    className="mt-1"
                  />
                  {errors.fecha_salida && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.fecha_salida.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha Retorno *</label>
                  <Input
                    type="date"
                    {...register("fecha_retorno", { required: "Requerida" })}
                    className="mt-1"
                  />
                  {errors.fecha_retorno && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.fecha_retorno.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Método Traslado *</label>
                <Select
                  onValueChange={(value) => setValue("metodo_traslado", value)}
                  value={watch("metodo_traslado")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZAR_RECURSOS_DEFAULTS.METODOS_TRASLADO.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Estado *</label>
                <Select
                  onValueChange={(value) => setValue("estado", value)}
                  value={watch("estado")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZAR_RECURSOS_DEFAULTS.ESTADOS_OBJETO.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isAddingInventario || !productoInfo}
                className="w-full"
              >
                {isAddingInventario ? "Agregando..." : "Agregar Objeto"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Objeto</TableHead>
              <TableHead className="text-center font-semibold">Cantidad</TableHead>
              <TableHead className="font-semibold">Fecha Salida</TableHead>
              <TableHead className="font-semibold">Fecha Retorno</TableHead>
              <TableHead className="font-semibold">Método Traslado</TableHead>
              <TableHead className="text-center font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingAsignado ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cargando objetos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !inventarioAsignado || inventarioAsignado.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Sin objetos asignados
                </TableCell>
              </TableRow>
            ) : (
              inventarioAsignado.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.Objeto_Nombre}
                  </TableCell>
                  <TableCell className="text-center">{item.cantidad_objeto}</TableCell>
                  <TableCell className="text-sm">
                    {item.fecha_salida ? formatDate(item.fecha_salida) : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.fecha_retorno ? formatDate(item.fecha_retorno) : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.metodo_traslado || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isRemovingInventario}
                      onClick={() =>
                        removeInventario({
                          projectId,
                          inventoryId: item.id,
                        })
                      }
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
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
