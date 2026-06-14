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
import { Textarea } from "@/shared/components/ui/textarea";
import { FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { createIncidentQuotation } from "../../api/incident.api";

interface CreateIncidentQuotationModalProps {
  incidentId: number;
  open: boolean;
  onClose: () => void;
}

export const CreateIncidentQuotationModal: FC<CreateIncidentQuotationModalProps> = ({
  incidentId,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    precio_subtotal: "",
    notas: "",
  });

  const handleGuardar = async () => {
    if (!form.nombre.trim()) {
      toast.error("El nombre de la cotización es obligatorio.");
      return;
    }
    setSaving(true);
    try {
      await createIncidentQuotation(incidentId, {
        nombre: form.nombre.trim(),
        precio_subtotal: form.precio_subtotal
          ? Number(form.precio_subtotal)
          : undefined,
        notas: form.notas.trim() || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ["incident-quotations", incidentId] });
      toast.success("Cotización creada correctamente.");
      setForm({ nombre: "", precio_subtotal: "", notas: "" });
      onClose();
    } catch {
      toast.error("No se pudo crear la cotización.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Crear cotización de incidencia
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            Incidencia #{incidentId}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Nombre */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="cq-nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cq-nombre"
              placeholder="Ej: COT-INC-004"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>

          {/* Precio subtotal */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="cq-precio">Precio Subtotal (S/) — Opcional</Label>
            <Input
              id="cq-precio"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={form.precio_subtotal}
              onChange={(e) =>
                setForm({ ...form, precio_subtotal: e.target.value })
              }
            />
          </div>

          {/* Notas */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="cq-notas">Notas — Opcional</Label>
            <Textarea
              id="cq-notas"
              rows={3}
              placeholder="Notas o comentarios sobre esta cotización..."
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-2 pt-1">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar} disabled={saving} className="gap-1">
              <Plus size={14} />
              {saving ? "Creando..." : "Crear Cotización"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
