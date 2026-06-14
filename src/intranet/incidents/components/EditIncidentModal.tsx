import { useState, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import type { Incident } from "../interfaces/incident";
import {
  IncidentStatesRecord,
  type IncidentState,
} from "../enum/incident-state.record";
import { updateIncident } from "../api/incident.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditIncidentModalProps {
  incident: Incident;
  open: boolean;
  onClose: () => void;
}

export const EditIncidentModal: FC<EditIncidentModalProps> = ({
  incident,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre_incidencia: incident.nombre_incidencia ?? "",
    empresa_involucrada: incident.empresa_involucrada,
    cotizacion_remuneracion: incident.cotizacion_remuneracion?.toString() ?? "",
    comentario: incident.comentario,
    estado: incident.estado,
  });

  const handleGuardar = async () => {
    setSaving(true);
    try {
      await updateIncident({
        id: incident.id_incidencia,
        nombre_incidencia: form.nombre_incidencia.trim() || null,
        empresa_involucrada: form.empresa_involucrada,
        cotizacion_remuneracion: form.cotizacion_remuneracion
          ? Number(form.cotizacion_remuneracion)
          : undefined,
        comentario: form.comentario,
        estado: form.estado,
      });
      await queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incidencia actualizada correctamente.");
      onClose();
    } catch {
      toast.error("No se pudo actualizar la incidencia.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Editar Incidencia #{incident.id_incidencia}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Cliente (read-only) */}
          <div className="flex flex-col gap-1">
            <Label>Cliente</Label>
            <Input value={incident.Cliente_Nombre} disabled />
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-1">
            <Label>Estado</Label>
            <Select
              value={form.estado}
              onValueChange={(val) =>
                setForm({ ...form, estado: val as IncidentState })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(IncidentStatesRecord).map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nombre de la incidencia */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Nombre de la incidencia</Label>
            <Input
              value={form.nombre_incidencia}
              onChange={(e) =>
                setForm({ ...form, nombre_incidencia: e.target.value })
              }
              placeholder="Ej: Falla en rociadores - Piso 3"
            />
          </div>

          {/* Empresa involucrada */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Empresa Involucrada (RUC)</Label>
            <Input
              value={form.empresa_involucrada}
              onChange={(e) =>
                setForm({ ...form, empresa_involucrada: e.target.value })
              }
            />
          </div>

          {/* Remuneración */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Cotización Remuneración (S/)</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="Opcional"
              value={form.cotizacion_remuneracion}
              onChange={(e) =>
                setForm({ ...form, cotizacion_remuneracion: e.target.value })
              }
            />
          </div>

          {/* Comentario */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Comentario</Label>
            <Textarea
              rows={3}
              value={form.comentario}
              onChange={(e) =>
                setForm({ ...form, comentario: e.target.value })
              }
            />
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleGuardar}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
