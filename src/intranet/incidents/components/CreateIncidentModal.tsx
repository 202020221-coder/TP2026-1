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
import {
  IncidentStatesRecord,
  type IncidentState,
} from "../enum/incident-state.record";
import { createIncident } from "../api/incident.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateIncidentModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateIncidentModal: FC<CreateIncidentModalProps> = ({
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id_proyecto: "",
    empresa_involucrada: "",
    cotizacion_remuneracion: "",
    comentario: "",
    estado: IncidentStatesRecord.sinEnviar as IncidentState,
  });

  const handleGuardar = async () => {
    if (!form.id_proyecto || !form.empresa_involucrada || !form.comentario) {
      toast.error("Completa los campos obligatorios.");
      return;
    }
    setSaving(true);
    try {
      await createIncident({
        id_proyecto: Number(form.id_proyecto),
        empresa_involucrada: form.empresa_involucrada,
        cotizacion_remuneracion: form.cotizacion_remuneracion
          ? Number(form.cotizacion_remuneracion)
          : null,
        comentario: form.comentario,
        estado: form.estado,
      });
      await queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incidencia creada correctamente.");
      setForm({
        id_proyecto: "",
        empresa_involucrada: "",
        cotizacion_remuneracion: "",
        comentario: "",
        estado: IncidentStatesRecord.sinEnviar,
      });
      onClose();
    } catch {
      toast.error("No se pudo crear la incidencia.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Nueva Incidencia
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* ID Proyecto */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="ci-proyecto">
              ID Proyecto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ci-proyecto"
              type="number"
              min={1}
              placeholder="ID del proyecto"
              value={form.id_proyecto}
              onChange={(e) =>
                setForm({ ...form, id_proyecto: e.target.value })
              }
            />
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

          {/* Empresa involucrada */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="ci-empresa">
              Empresa Involucrada (RUC) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ci-empresa"
              placeholder="Ej: 20501234567"
              value={form.empresa_involucrada}
              onChange={(e) =>
                setForm({ ...form, empresa_involucrada: e.target.value })
              }
            />
          </div>

          {/* Remuneración */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="ci-remuneracion">
              Cotización Remuneración (S/) — Opcional
            </Label>
            <Input
              id="ci-remuneracion"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={form.cotizacion_remuneracion}
              onChange={(e) =>
                setForm({ ...form, cotizacion_remuneracion: e.target.value })
              }
            />
          </div>

          {/* Comentario */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="ci-comentario">
              Comentario <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="ci-comentario"
              rows={3}
              placeholder="Describe la incidencia..."
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
            <Button onClick={handleGuardar} disabled={saving}>
              {saving ? "Guardando..." : "Crear Incidencia"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
