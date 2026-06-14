import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import type { InvolvedObjectCategory } from "../../interfaces/incident-quotation";
import type { EditorMode, ObjectFormState, ObjectOccurrence } from "./types";

const OCCURRENCE_OPTIONS: Array<{ value: ObjectOccurrence; label: string }> = [
  { value: "perdida", label: "Perdida" },
  { value: "robo", label: "Robo" },
];

interface IncidentObjectEditorDialogProps {
  open: boolean;
  mode: EditorMode;
  form: ObjectFormState;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (next: ObjectFormState) => void;
  onSubmit: () => void;
}

export function IncidentObjectEditorDialog({
  open,
  mode,
  form,
  saving,
  onOpenChange,
  onFormChange,
  onSubmit,
}: IncidentObjectEditorDialogProps) {
  const readOnly = mode === "view";
  const isCreate = mode === "create";
  const showCatalog = isCreate && form.categoria === "Objetos";

  const { data: inventoryItems = [] } = useQuery({
    queryKey: ["inventory-catalog"],
    queryFn: async () => {
      const { default: axiosInstance } = await import("@/shared/api/axios.config");
      const res = await axiosInstance.get<{ id: number; nombre: string; cantidad: number }[]>("/inventario", { params: { limit: 200 } });
      if (Array.isArray(res.data)) return res.data;
      if (res.data && typeof res.data === "object" && "data" in res.data) return (res.data as any).data ?? [];
      return [];
    },
    enabled: open && showCatalog,
    staleTime: 60000,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Agregar objeto involucrado"
              : mode === "edit"
                ? "Editar objeto involucrado"
                : "Detalle de objeto involucrado"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para registrar o actualizar datos del objeto involucrado de la incidencia.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label>Categoría</Label>
            <Select
              value={form.categoria}
              onValueChange={(value) =>
                onFormChange({
                  ...form,
                  categoria: value as InvolvedObjectCategory,
                  objeto: "",
                })
              }
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Objetos">Objetos</SelectItem>
                <SelectItem value="Camiones">Camiones</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Fecha de pérdida</Label>
            <Input
              type="date"
              value={form.fecha_perdida}
              onChange={(event) =>
                onFormChange({ ...form, fecha_perdida: event.target.value })
              }
              disabled={readOnly}
            />
          </div>

          {showCatalog ? (
            <div className="flex flex-col gap-1">
              <Label>Objeto</Label>
              <Select
                value={form.objeto}
                onValueChange={(value) =>
                  onFormChange({ ...form, objeto: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar del inventario..." />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.nombre}>
                      {item.nombre} (Disponible: {item.cantidad})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Label>Objeto / Placa</Label>
              <Input
                value={form.objeto}
                onChange={(event) =>
                  onFormChange({ ...form, objeto: event.target.value })
                }
                disabled={readOnly}
                placeholder={form.categoria === "Camiones" ? "Ej: ABC-123" : ""}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label>Precio a remunerar (S/)</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={form.precio_remunerar}
              onChange={(event) =>
                onFormChange({ ...form, precio_remunerar: event.target.value })
              }
              disabled={readOnly}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Cantidad involucrada</Label>
            <Input
              type="number"
              min={0}
              value={form.cantidad_involucrada}
              onChange={(event) =>
                onFormChange({ ...form, cantidad_involucrada: event.target.value })
              }
              disabled={readOnly}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Cantidad enviada</Label>
            <Input
              type="number"
              min={0}
              value={form.cantidad_enviada}
              onChange={(event) =>
                onFormChange({ ...form, cantidad_enviada: event.target.value })
              }
              disabled={readOnly}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
            <Label>Ocurrencia</Label>
            <Select
              value={form.ocurrencia}
              onValueChange={(value) =>
                onFormChange({ ...form, ocurrencia: value as ObjectOccurrence })
              }
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona ocurrencia" />
              </SelectTrigger>
              <SelectContent>
                {OCCURRENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
            <Label>Última ubicación</Label>
            <Input
              value={form.ultima_ubicacion}
              onChange={(event) =>
                onFormChange({ ...form, ultima_ubicacion: event.target.value })
              }
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            {readOnly ? "Cerrar" : "Cancelar"}
          </Button>

          {!readOnly ? (
            <Button type="button" onClick={onSubmit} disabled={saving}>
              {saving ? "Guardando..." : mode === "create" ? "Agregar" : "Guardar cambios"}
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
