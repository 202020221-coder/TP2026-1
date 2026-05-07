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
import type { Project } from "../interfaces/project";
import {
  ProjectStatesRecord,
  type ProjectState,
} from "../enum/project-state.record";

interface EditProjectModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export const EditProjectModal: FC<EditProjectModalProps> = ({
  project,
  open,
  onClose,
}) => {
  const [form, setForm] = useState<Project>({ ...project });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Editar Proyecto
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">

          {/* Nombre del servicio */}
          <div className="flex flex-col gap-1">
            <Label>Nombre del servicio</Label>
            <Input
              value={form.descripcion_servicio ?? ""}
              onChange={(e) =>
                setForm({ ...form, descripcion_servicio: e.target.value })
              }
            />
          </div>

          {/* Factura + Guardar */}
          <div className="flex items-end justify-end gap-2">
            <Button variant="outline" type="button">
              Factura
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={onClose}
            >
              Guardar
            </Button>
          </div>

          {/* Descripción del servicio */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Descripción del servicio</Label>
            <Textarea rows={3} />
          </div>

          {/* Ubicación */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Ubicación</Label>
            <Input value={form.ubicacion ?? ""} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} />
          </div>

          {/* ID Cotización */}
          <div className="flex flex-col gap-1">
            <Label>ID Cotización</Label>
            <Input value={form.id_cotizacion ?? ""} disabled />
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-1">
            <Label>Estado</Label>
            <Select
              value={form.estado}
              onValueChange={(val) =>
                setForm({ ...form, estado: val as ProjectState })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProjectStatesRecord).map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha inicio */}
          <div className="flex flex-col gap-1">
            <Label>Fecha inicio</Label>
            <Input
              type="date"
              value={form.fecha_inicio ?? ""}
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e) =>
                setForm({ ...form, fecha_inicio: e.target.value })
              }
            />
          </div>

          {/* Fecha final */}
          <div className="flex flex-col gap-1">
            <Label>Fecha final</Label>
            <Input
              type="date"
              value={form.fecha_fin ?? ""}
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e) =>
                setForm({ ...form, fecha_fin: e.target.value })
              }
            />
          </div>

          {/* Observaciones */}
          <div className="col-span-2 flex flex-col gap-1">
            <Label>Observaciones</Label>
            <Textarea rows={3} />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};