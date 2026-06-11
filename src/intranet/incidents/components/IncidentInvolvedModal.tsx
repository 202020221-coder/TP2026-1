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
import { useQuery } from "@tanstack/react-query";
import { getIncidentInvolved } from "../api/incident.api";
import { toast } from "sonner";
import { Trash2, Plus, Users } from "lucide-react";

const WRITE_NOT_CONNECTED_MESSAGE =
  "Los endpoints de creación y edición aún no están conectados.";

interface IncidentInvolvedModalProps {
  incidentId: number;
  open: boolean;
  onClose: () => void;
}

export const IncidentInvolvedModal: FC<IncidentInvolvedModalProps> = ({
  incidentId,
  open,
  onClose,
}) => {
  const [form, setForm] = useState({ nombre: "", rol: "" });

  const { data: involved, isPending } = useQuery({
    queryKey: ["incident-involved", incidentId],
    queryFn: () => getIncidentInvolved(incidentId),
    enabled: open,
  });

  const handleAdd = () => {
    if (!form.nombre.trim() || !form.rol.trim()) {
      toast.error("Completa todos los campos.");
      return;
    }

    toast.info(WRITE_NOT_CONNECTED_MESSAGE);
  };

  const handleDelete = () => {
    toast.info(WRITE_NOT_CONNECTED_MESSAGE);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Involucrados — Incidencia #{incidentId}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-2 max-h-52 overflow-y-auto pr-1">
          {isPending ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : involved && involved.length > 0 ? (
            involved.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between border rounded-lg px-3 py-2 bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {inv.nombre}
                  </span>
                  <span className="text-xs text-gray-500">
                    {inv.cargo ?? inv.perfil_registrado ?? inv.dni ?? "—"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic py-4 text-center">
              No hay involucrados registrados.
            </p>
          )}
        </div>

        <div className="border-t pt-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="inv-nombre">Nombre</Label>
            <Input
              id="inv-nombre"
              placeholder="Nombre del involucrado"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="inv-rol">Rol</Label>
            <Input
              id="inv-rol"
              placeholder="Ej: Conductor, Supervisor..."
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button onClick={handleAdd} className="gap-1">
              <Plus className="w-4 h-4" />
              Agregar Involucrado
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
