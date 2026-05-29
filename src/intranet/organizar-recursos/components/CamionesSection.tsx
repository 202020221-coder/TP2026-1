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
import { Plus, Pencil, Loader2 } from "lucide-react";
import {
  useAddCamionToProyecto,
  useUpdateCamionFromProyecto,
  useConductoresDisponibles,
  useCamionesByProyecto,
  useIncidenciasByProyecto,
} from "../hooks/useOrganizarRecursos";
import type { Camion } from "../interfaces/proyecto";
import { formatDate } from "@/shared/lib/utils";
import { ORGANIZAR_RECURSOS_DEFAULTS } from "../lib/constants";

interface CamioneSectionProps {
  projectId: number;
  canEdit: boolean;
}

type CamionFormData = {
  placa: string;
  conductor: string;
  fecha_salida: string;
  hora_salida: string;
  fecha_entrada: string;
  hora_entrada: string;
  razon: string;
  estado: string;
};

export function CamionesSection({ projectId, canEdit }: CamioneSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCamion, setEditingCamion] = useState<Camion | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const { data: camiones, isLoading: loadingCamiones } = useCamionesByProyecto(projectId);
  const { data: incidencias } = useIncidenciasByProyecto(projectId);

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
      razon: "entrada",
      estado: "aceptable",
    },
  });

  const fechaSalida = watch("fecha_salida");

  const { data: conductoresDisponibles, isLoading: loadingConductores } =
    useConductoresDisponibles(fechaSalida);
  const { mutate: addCamion, isPending: isAddingCamion } = useAddCamionToProyecto();
  const { mutate: updateCamion, isPending: isUpdatingCamion } = useUpdateCamionFromProyecto();

  const editForm = useForm<CamionFormData>({
    defaultValues: { placa: "", conductor: "", fecha_salida: today, hora_salida: "08:00", fecha_entrada: today, hora_entrada: "17:00", razon: "entrada", estado: "aceptable" },
  });

  const openEdit = (camion: Camion) => {
    setEditingCamion(camion);
    const salida = camion.fecha_hora_salida ? camion.fecha_hora_salida.split("T") : [today, "08:00"];
    const entrada = camion.fecha_hora_entrada ? camion.fecha_hora_entrada.split("T") : [today, "17:00"];
    editForm.reset({
      placa: camion.Placa,
      conductor: "",
      fecha_salida: salida[0],
      hora_salida: salida[1]?.slice(0, 5) ?? "08:00",
      fecha_entrada: entrada[0],
      hora_entrada: entrada[1]?.slice(0, 5) ?? "17:00",
      razon: camion.razon ?? "entrada",
      estado: camion.estado ?? "aceptable",
    });
  };

  const onEditSubmit = editForm.handleSubmit((data) => {
    if (!editingCamion) return;
    updateCamion(
      {
        projectId,
        camionId: editingCamion.id,
        payload: {
          Placa: data.placa,
          personal_manejando: 1,
          fecha_hora_salida: `${data.fecha_salida} ${data.hora_salida}:00`,
          fecha_hora_entrada: `${data.fecha_entrada} ${data.hora_entrada}:00`,
          razon: data.razon,
          estado: data.estado,
        },
      },
      { onSettled: () => setEditingCamion(null) }
    );
  });

  const onSubmit = (data: CamionFormData) => {
    addCamion(
      {
        projectId,
        payload: {
          Placa: data.placa,
          personal_manejando: 1,
          fecha_hora_salida: `${data.fecha_salida} ${data.hora_salida}:00`,
          fecha_hora_entrada: `${data.fecha_entrada} ${data.hora_entrada}:00`,
          razon: data.razon,
          estado: data.estado,
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
        <h3 className="text-lg font-semibold">Camiones</h3>
        {canEdit ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Camión
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[85vw] max-h-[90vh] flex flex-col overflow-hidden">
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
                      <SelectItem value="__loading__" disabled>
                        Cargando conductores...
                      </SelectItem>
                    ) : conductoresDisponibles && conductoresDisponibles.length > 0 ? (
                      conductoresDisponibles.map((c) => (
                        <SelectItem key={c.DNI} value={c.DNI}>
                          {c.Nombre} {c.Apellido} ({c.DNI})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="__sin-conductores__" disabled>
                        Sin conductores disponibles en esta fecha
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
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

              <div>
                <label className="text-sm font-medium">Razón *</label>
                <Select
                  onValueChange={(value) => setValue("razon", value)}
                  value={watch("razon")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    {incidencias?.map((inc) => (
                      <SelectItem
                        key={inc.id_incidencia}
                        value={inc.comentario}
                      >
                        #{inc.id_incidencia} — {inc.comentario}
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
                    <SelectItem value="aceptable">
                      {ORGANIZAR_RECURSOS_DEFAULTS.ESTADOS_OBJETO[0].label}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isAddingCamion || !watch("placa")} className="w-full">
                {isAddingCamion ? "Agregando..." : "Agregar Camión"}
              </Button>
            </form>
            </DialogContent>
          </Dialog>
        ) : (
          <span className="text-sm text-muted-foreground">Solo lectura</span>
        )}
      </div>

      {/* Dialog edición */}
      {canEdit ? (
        <Dialog open={!!editingCamion} onOpenChange={(open) => !open && setEditingCamion(null)}>
          <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[85vw] max-h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>Editar Camión — {editingCamion?.Placa}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onEditSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Placa *</label>
              <Input placeholder="Ej: ABC-123" {...editForm.register("placa", { required: "Requerida" })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fecha Salida *</label>
                <Input type="date" {...editForm.register("fecha_salida", { required: "Requerida" })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Hora Salida *</label>
                <Input type="time" {...editForm.register("hora_salida", { required: "Requerida" })} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fecha Entrada *</label>
                <Input type="date" {...editForm.register("fecha_entrada", { required: "Requerida" })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Hora Entrada *</label>
                <Input type="time" {...editForm.register("hora_entrada", { required: "Requerida" })} className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Razón *</label>
              <Select onValueChange={(v) => editForm.setValue("razon", v)} value={editForm.watch("razon")}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  {incidencias?.map((inc) => (
                    <SelectItem key={inc.id_incidencia} value={inc.comentario}>
                      #{inc.id_incidencia} — {inc.comentario}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Estado *</label>
              <Select onValueChange={(v) => editForm.setValue("estado", v)} value={editForm.watch("estado")}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aceptable">{ORGANIZAR_RECURSOS_DEFAULTS.ESTADOS_OBJETO[0].label}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isUpdatingCamion} className="w-full">
              {isUpdatingCamion ? "Guardando..." : "Guardar Cambios"}
            </Button>
            </form>
          </DialogContent>
        </Dialog>
      ) : null}

      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Placa</TableHead>
              <TableHead className="font-semibold">Nombre Camión</TableHead>
              <TableHead className="font-semibold">Fecha Salida</TableHead>
              <TableHead className="font-semibold">Fecha Entrada</TableHead>
              <TableHead className="text-center font-semibold">Personal</TableHead>
              <TableHead className="font-semibold">Razón</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="text-center font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingCamiones ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cargando camiones...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !camiones || camiones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                  <TableCell className="text-sm max-w-[150px] truncate">
                    <span title={camion.razon || "—"}>{camion.razon || "—"}</span>
                  </TableCell>
                  <TableCell className="text-sm">{camion.estado || "—"}</TableCell>
                  <TableCell className="text-center">
                    {canEdit ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(camion)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Solo lectura</span>
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
