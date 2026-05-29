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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getIncidentObjects,
  addIncidentObject,
  deleteIncidentObject,
} from "../api/incident.api";
import { toast } from "sonner";
import { Trash2, Plus, PackageSearch } from "lucide-react";

interface IncidentObjectsModalProps {
  incidentId: number;
  open: boolean;
  onClose: () => void;
}

export const IncidentObjectsModal: FC<IncidentObjectsModalProps> = ({
  incidentId,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ tipo: "", descripcion: "" });

  const { data: objects, isPending } = useQuery({
    queryKey: ["incident-objects", incidentId],
    queryFn: () => getIncidentObjects(incidentId),
    enabled: open,
  });

  const handleAdd = async () => {
    if (!form.tipo.trim() || !form.descripcion.trim()) {
      toast.error("Completa todos los campos.");
      return;
    }
    setAdding(true);
    try {
      await addIncidentObject(incidentId, form);
      await queryClient.invalidateQueries({
        queryKey: ["incident-objects", incidentId],
      });
      toast.success("Objeto agregado.");
      setForm({ tipo: "", descripcion: "" });
    } catch {
      toast.error("No se pudo agregar el objeto.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (oid: number) => {
    toast.promise(
      deleteIncidentObject(incidentId, oid).then(() =>
        queryClient.invalidateQueries({
          queryKey: ["incident-objects", incidentId],
        })
      ),
      {
        loading: "Eliminando...",
        success: "Objeto eliminado.",
        error: "No se pudo eliminar.",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <PackageSearch className="w-5 h-5 text-violet-500" />
            Objetos / Camiones — Incidencia #{incidentId}
          </DialogTitle>
        </DialogHeader>

        {/* Lista de objetos */}
        <div className="mt-2 space-y-2 max-h-52 overflow-y-auto pr-1">
          {isPending ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : objects && objects.length > 0 ? (
            objects.map((obj) => (
              <div
                key={obj.id}
                className="flex items-center justify-between border rounded-lg px-3 py-2 bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {obj.tipo}
                  </span>
                  <span className="text-xs text-gray-500">{obj.descripcion}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(obj.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic py-4 text-center">
              No hay objetos registrados.
            </p>
          )}
        </div>

        {/* Formulario de agregar */}
        <div className="border-t pt-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="obj-tipo">Tipo</Label>
            <Input
              id="obj-tipo"
              placeholder="Ej: Camión, Equipo..."
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="obj-desc">Descripción</Label>
            <Input
              id="obj-desc"
              placeholder="Descripción del objeto"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button onClick={handleAdd} disabled={adding} className="gap-1">
              <Plus className="w-4 h-4" />
              {adding ? "Agregando..." : "Agregar Objeto"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
