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
import { Plus, Trash2 } from "lucide-react";
import type { Camion } from "../interfaces/proyecto";
import {
  useAddCamionToProyecto,
  useRemoveCamionFromProyecto,
  useConductoresDisponibles,
} from "../hooks/useOrganizarRecursos";
import { formatDate } from "@/shared/lib/utils";

interface CamioneSectionProps {
  projectId: number;
  camiones: Camion[];
  onRefresh: () => void;
}

type CamionFormData = {
  placa: string;
  conductor: string;
  fecha_salida: string;
  hora_salida: string;
  fecha_entrada: string;
  hora_entrada: string;
};

export function CamionesSection({
  projectId,
  camiones,
  onRefresh,
}: CamioneSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CamionFormData>({
    defaultValues: {
      placa: "",
      conductor: "",
      fecha_salida: today,
      hora_salida: "08:00",
      fecha_entrada: today,
      hora_entrada: "17:00",
    },
  });

  const fechaSalida = watch("fecha_salida");

  const { data: conductoresDisponibles, isLoading: loadingConductores } =
    useConductoresDisponibles(fechaSalida);
  const { mutate: addCamion, isPending: isAddingCamion } =
    useAddCamionToProyecto();
  const { mutate: removeCamion, isPending: isRemovingCamion } =
    useRemoveCamionFromProyecto();

  const onSubmit = (data: CamionFormData) => {
    addCamion(
      {
        projectId,
        payload: {
          Placa: data.placa,
          personal_manejando: 1,
          fecha_hora_salida: `${data.fecha_salida} ${data.hora_salida}:00`,
          fecha_hora_entrada: `${data.fecha_entrada} ${data.hora_entrada}:00`,
        },
      },
      {
        onSettled: () => {
          setIsOpen(false);
          reset();
          onRefresh();
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Camiones</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Camión
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar Camión al Proyecto</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Placa *</label>
                <Input
                  placeholder="Ej: ABC-123"
                  {...register("placa", { required: "La placa es requerida" })}
                  className="mt-1"
                />
                {errors.placa && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.placa.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Conductor disponible *</label>
                <Select
                  onValueChange={(value) => setValue("conductor", value)}
                  value={watch("conductor")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar conductor..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {loadingConductores ? (
                      <SelectItem value="loading" disabled>
                        Cargando conductores...
                      </SelectItem>
                    ) : conductoresDisponibles && conductoresDisponibles.length > 0 ? (
                      conductoresDisponibles.map((c) => (
                        <SelectItem key={c.DNI} value={c.DNI}>
                          {c.Nombre} {c.Apellido} ({c.DNI})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="sin-conductores" disabled>
                        Sin conductores disponibles en esta fecha
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.conductor && (
                  <p className="text-sm text-destructive mt-1">
                    Conductor requerido
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
                  <label className="text-sm font-medium">Hora Salida *</label>
                  <Input
                    type="time"
                    {...register("hora_salida", { required: "Requerida" })}
                    className="mt-1"
                  />
                  {errors.hora_salida && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.hora_salida.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Fecha Entrada *</label>
                  <Input
                    type="date"
                    {...register("fecha_entrada", { required: "Requerida" })}
                    className="mt-1"
                  />
                  {errors.fecha_entrada && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.fecha_entrada.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Hora Entrada *</label>
                  <Input
                    type="time"
                    {...register("hora_entrada", { required: "Requerida" })}
                    className="mt-1"
                  />
                  {errors.hora_entrada && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.hora_entrada.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isAddingCamion} className="w-full">
                {isAddingCamion ? "Agregando..." : "Agregar Camión"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Placa</TableHead>
              <TableHead className="font-semibold">Nombre Camión</TableHead>
              <TableHead className="font-semibold">Fecha Salida</TableHead>
              <TableHead className="font-semibold">Fecha Entrada</TableHead>
              <TableHead className="text-center font-semibold">Personal</TableHead>
              <TableHead className="text-center font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {camiones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Sin camiones asignados
                </TableCell>
              </TableRow>
            ) : (
              camiones.map((camion) => (
                <TableRow key={camion.id}>
                  <TableCell className="font-medium">{camion.Placa}</TableCell>
                  <TableCell className="text-sm">{camion.Camion_Nombre}</TableCell>
                  <TableCell className="text-sm">
                    {camion.fecha_hora_salida
                      ? formatDate(camion.fecha_hora_salida)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {camion.fecha_hora_entrada
                      ? formatDate(camion.fecha_hora_entrada)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-center">
                    {camion.personal_manejando}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isRemovingCamion}
                      onClick={() =>
                        removeCamion(
                          { projectId, camionId: camion.id },
                          { onSettled: onRefresh }
                        )
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
