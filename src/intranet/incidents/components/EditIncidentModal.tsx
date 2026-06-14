import { useState, useEffect, type FC } from "react";
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
import { getQuotationForAdmin } from "@/intranet/quotation/api/quotation.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClientAutocomplete } from "./ClientAutocomplete";

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
  const [remunerationQuotation, setRemunerationQuotation] = useState<{ id: number; nombre: string } | null>(null);
  const [form, setForm] = useState({
    nombre_incidencia: incident.nombre_incidencia ?? "",
    empresa_involucrada: incident.empresa_involucrada,
    cotizacion_remuneracion: incident.cotizacion_remuneracion?.toString() ?? "",
    comentario: incident.comentario,
    estado: incident.estado,
  });

  const cotId = Number(form.cotizacion_remuneracion);

  useEffect(() => {
    if (!open || !cotId) {
      setRemunerationQuotation(null);
      return;
    }
    const timer = setTimeout(() => {
      getQuotationForAdmin(cotId)
        .then((q) => setRemunerationQuotation({ id: q.id, nombre: q.nombre }))
        .catch(() => setRemunerationQuotation(null));
    }, 400);
    return () => clearTimeout(timer);
  }, [open, cotId]);

  const handleGuardar = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        id: incident.id_incidencia,
        empresa_involucrada: form.empresa_involucrada,
        comentario: form.comentario,
        estado: form.estado,
      };
      if (form.nombre_incidencia.trim()) {
        body.nombre_incidencia = form.nombre_incidencia.trim();
      }
      if (form.cotizacion_remuneracion) {
        body.cotizacion_remuneracion = Number(form.cotizacion_remuneracion);
      }
      await updateIncident(body as any);
      await queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incidencia actualizada correctamente.");
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? e?.response?.data?.message ?? e?.message ?? "Error desconocido";
      toast.error(`No se pudo actualizar: ${msg}`);
      console.error("Update incident error:", e?.response?.data ?? e);
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
                {Object.values(IncidentStatesRecord)
                  .filter((estado) => {
                    if (
                      incident.estado === IncidentStatesRecord.pagoRealizado ||
                      incident.estado === IncidentStatesRecord.materialRecuperado
                    )
                      return estado === incident.estado;
                    if (incident.estado !== IncidentStatesRecord.sinEnviar)
                      return estado !== IncidentStatesRecord.sinEnviar;
                    return true;
                  })
                  .map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {incident.estado !== IncidentStatesRecord.sinEnviar &&
              incident.estado !== IncidentStatesRecord.pagoRealizado &&
              incident.estado !== IncidentStatesRecord.materialRecuperado && (
                <p className="text-xs text-amber-600 mt-0.5">
                  No puede retroceder a "Sin enviar"
                </p>
              )}
            {(incident.estado === IncidentStatesRecord.pagoRealizado ||
              incident.estado === IncidentStatesRecord.materialRecuperado) && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Estado terminal — no modificable
              </p>
            )}
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
            <Label>Empresa Involucrada</Label>
            <ClientAutocomplete
              value={form.empresa_involucrada}
              onChange={(ruc) => setForm({ ...form, empresa_involucrada: ruc })}
              placeholder="Buscar por RUC o razón social"
            />
            {form.empresa_involucrada && (
              <p className="text-xs text-muted-foreground">
                RUC: {form.empresa_involucrada}
              </p>
            )}
          </div>

        {/* Remuneración */}
        <div className="col-span-2 flex flex-col gap-1">
          <Label>Cotización de Remuneración (ID)</Label>
          <div className="flex gap-2 items-start">
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="ID de la cotización"
              value={form.cotizacion_remuneracion}
              onChange={(e) => {
                setForm({ ...form, cotizacion_remuneracion: e.target.value });
                setRemunerationQuotation(null);
              }}
              className="flex-1"
            />
          </div>
          {remunerationQuotation && (
            <p className="text-xs text-muted-foreground mt-0.5">
              #{remunerationQuotation.id} — {remunerationQuotation.nombre}
            </p>
          )}
          {form.cotizacion_remuneracion && !remunerationQuotation && (
            <p className="text-xs text-amber-600 mt-0.5">
              Buscando cotización...
            </p>
          )}
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
