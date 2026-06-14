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
import { FileText, Save } from "lucide-react";
import { toast } from "sonner";
import type { IncidentQuotation } from "../../interfaces/incident-quotation";
import type { QuotationState } from "../../enum/quotation-state.record";

interface EditIncidentQuotationModalProps {
  quotation: IncidentQuotation;
  open: boolean;
  onClose: () => void;
}

const STATE_TRANSITIONS: Record<string, string[]> = {
  Pendiente: ["Pendiente", "Enviado", "Rechazado"],
  Enviado: ["Enviado", "Aprobado", "Rechazado", "Disputado"],
  Aprobado: ["Aprobado", "Pago realizado"],
  Rechazado: ["Rechazado"],
  Disputado: ["Disputado", "Enviado"],
  "Pago realizado": ["Pago realizado"],
};

export const EditIncidentQuotationModal: FC<EditIncidentQuotationModalProps> = ({
  quotation,
  open,
  onClose,
}) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: quotation.nombre,
    precio_subtotal: quotation.precio_subtotal?.toString() ?? "",
    notas: "",
    estado: quotation.estado,
  });

  const allowedStates = STATE_TRANSITIONS[quotation.estado] ?? [quotation.estado];

  const handleGuardar = async () => {
    if (!form.nombre.trim()) {
      toast.error("El nombre de la cotización es obligatorio.");
      return;
    }
    setSaving(true);
    // TODO: conectar con PUT /incidencias/{id}/cotizaciones/{id} cuando el backend esté listo
    await new Promise((res) => setTimeout(res, 800));
    toast.success("Cotización actualizada correctamente.");
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Editar cotización
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            {quotation.nombre} — v{quotation.version}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Nombre */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="eq-nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="eq-nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>

          {/* Precio */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="eq-precio">Precio Subtotal (S/) — Opcional</Label>
            <Input
              id="eq-precio"
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

          {/* Estado */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Estado</Label>
            <Select
              value={form.estado}
              onValueChange={(val) =>
                setForm({ ...form, estado: val as QuotationState })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allowedStates.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {allowedStates.length === 1 && quotation.estado === "Pago realizado" && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Cotización finalizada — estado no modificable
              </p>
            )}
            {quotation.estado === "Aprobado" && (
              <p className="text-xs text-amber-600 mt-0.5">
                Cotización aprobada — solo puede pasar a "Pago realizado"
              </p>
            )}
          </div>

          {/* Notas */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="eq-notas">Notas — Opcional</Label>
            <Textarea
              id="eq-notas"
              rows={3}
              placeholder="Notas adicionales..."
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
              <Save size={14} />
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
