import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, Plus, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog";
import { Button } from "../../../shared/components/ui/button";
import {
  addIncidentObject,
  deleteIncidentObject,
  getIncidentObjects,
  updateIncidentObject,
} from "../api/incident.api";
import type {
  InvolvedObject,
  InvolvedObjectCategory,
} from "../interfaces/incident-quotation";
import { toast } from "sonner";
import { IncidentObjectEditorDialog } from "./incident-objects/IncidentObjectEditorDialog";
import { IncidentObjectsSection } from "./incident-objects/IncidentObjectsSection";
import { EMPTY_OBJECT_FORM, type EditorMode } from "./incident-objects/types";
import { normalizeCategory, toApiPayload, toFormState } from "./incident-objects/utils";

interface IncidentObjectsModalProps {
  incidentId: number;
  open: boolean;
  onClose: () => void;
}

export function IncidentObjectsModal({
  incidentId,
  open,
  onClose,
}: IncidentObjectsModalProps) {
  const queryClient = useQueryClient();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("create");
  const [editingObjectId, setEditingObjectId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_OBJECT_FORM);

  const queryKey = ["incident-objects", incidentId];

  const { data: objects = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => getIncidentObjects(incidentId),
    enabled: open && incidentId > 0,
  });

  const createMutation = useMutation({
    mutationFn: () => addIncidentObject(incidentId, toApiPayload(form)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Objeto agregado correctamente.");
      setEditorOpen(false);
    },
    onError: () => {
      toast.error("No se pudo agregar el objeto.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!editingObjectId) {
        throw new Error("No hay objeto para actualizar");
      }
      return updateIncidentObject(incidentId, editingObjectId, toApiPayload(form));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Objeto actualizado correctamente.");
      setEditorOpen(false);
    },
    onError: () => {
      toast.error("No se pudo actualizar el objeto.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (objectId: number) => deleteIncidentObject(incidentId, objectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Objeto eliminado correctamente.");
    },
    onError: () => {
      toast.error("No se pudo eliminar el objeto.");
    },
  });

  const groupedObjects = useMemo(
    () => ({
      Objetos: objects.filter((item) => normalizeCategory(item.categoria) === "Objetos"),
      Camiones: objects.filter((item) => normalizeCategory(item.categoria) === "Camiones"),
    }),
    [objects],
  );

  const openCreate = (category: InvolvedObjectCategory = "Objetos") => {
    setEditorMode("create");
    setEditingObjectId(null);
    setForm({ ...EMPTY_OBJECT_FORM, categoria: category });
    setEditorOpen(true);
  };

  const openView = (item: InvolvedObject) => {
    setEditorMode("view");
    setEditingObjectId(item.id);
    setForm(toFormState(item));
    setEditorOpen(true);
  };

  const openEdit = (item: InvolvedObject) => {
    setEditorMode("edit");
    setEditingObjectId(item.id);
    setForm(toFormState(item));
    setEditorOpen(true);
  };

  const handleDelete = (objectId: number) => {
    const confirmed =
      typeof window !== "undefined" &&
      window.confirm(
        "Esta acción eliminará el objeto involucrado. ¿Deseas continuar?",
      );
    if (!confirmed) return;
    deleteMutation.mutate(objectId);
  };

  const handleSubmit = () => {
    if (!form.objeto.trim() || !form.ocurrencia || !form.ultima_ubicacion.trim()) {
      toast.error("Completa los campos obligatorios del objeto.");
      return;
    }

    if (form.ocurrencia !== "perdida" && form.ocurrencia !== "robo") {
      toast.error("La ocurrencia solo puede ser 'perdida' o 'robo'.");
      return;
    }

    const cantidadInvolucrada = Number(form.cantidad_involucrada);
    const cantidadEnviada = Number(form.cantidad_enviada);

    if (!Number.isFinite(cantidadInvolucrada) || cantidadInvolucrada < 0) {
      toast.error("La cantidad involucrada debe ser un número válido.");
      return;
    }

    if (!Number.isFinite(cantidadEnviada) || cantidadEnviada < 0) {
      toast.error("La cantidad enviada debe ser un número válido.");
      return;
    }

    if (editorMode === "create") {
      createMutation.mutate();
      return;
    }

    if (editorMode === "edit") {
      updateMutation.mutate();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(nextOpen: boolean) => !nextOpen && onClose()}>
        <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl">Objetos involucrados</DialogTitle>
                <DialogDescription className="sr-only">
                  Gestiona objetos y camiones vinculados a la incidencia seleccionada.
                </DialogDescription>
                <p className="text-sm text-muted-foreground">Incidencia #{incidentId}</p>
              </div>

              <Button
                variant="destructive"
                className="mr-10 gap-2 font-medium"
                size="sm"
                type="button"
                onClick={() => openCreate("Objetos")}
              >
                <Plus size={14} />
                Agregar Objeto
              </Button>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 min-h-0 pr-1">
            <div className="space-y-6 pb-2">
              <IncidentObjectsSection
                title="Objeto involucrado"
                firstColumnLabel="Objetos"
                headerIcon={<Package size={14} />}
                items={groupedObjects.Objetos}
                isLoading={isLoading}
                onView={openView}
                onEdit={openEdit}
                onDelete={handleDelete}
              />

              <IncidentObjectsSection
                title="Camiones"
                firstColumnLabel="Camiones"
                headerIcon={<Truck size={14} />}
                items={groupedObjects.Camiones}
                isLoading={isLoading}
                onView={openView}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <IncidentObjectEditorDialog
        open={editorOpen}
        mode={editorMode}
        form={form}
        saving={createMutation.isPending || updateMutation.isPending}
        onFormChange={setForm}
        onSubmit={handleSubmit}
        onOpenChange={(nextOpen) => {
          setEditorOpen(nextOpen);
          if (!nextOpen) {
            setForm(EMPTY_OBJECT_FORM);
            setEditingObjectId(null);
          }
        }}
      />
    </>
  );
}
