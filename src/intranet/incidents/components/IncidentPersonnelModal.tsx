import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { toast } from "sonner";
import { getIncidentInvolved } from "../api/incident.api";
import type { IncidentInvolved } from "../interfaces/incident";
import { IncidentPersonnelCard } from "./incident-personnel/IncidentPersonnelCard";
import { IncidentPersonnelForm } from "./incident-personnel/IncidentPersonnelForm";
import {
  EMPTY_PERSONNEL_FORM,
  type EditorMode,
  type PersonnelFormState,
} from "./incident-personnel/types";
import { toFormState, validatePersonnelForm } from "./incident-personnel/utils";

const WRITE_NOT_CONNECTED_MESSAGE =
  "Los endpoints de creación y edición aún no están conectados.";

interface IncidentPersonnelModalProps {
  incidentId: number;
  open: boolean;
  onClose: () => void;
}

export function IncidentPersonnelModal({
  incidentId,
  open,
  onClose,
}: IncidentPersonnelModalProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("create");
  const [form, setForm] = useState<PersonnelFormState>(EMPTY_PERSONNEL_FORM);

  const { data: personnel = [], isLoading } = useQuery({
    queryKey: ["incident-involved", incidentId],
    queryFn: () => getIncidentInvolved(incidentId),
    enabled: open && incidentId > 0,
  });

  const handleSubmit = () => {
    const validationError = validatePersonnelForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    toast.info(WRITE_NOT_CONNECTED_MESSAGE);
  };

  const handleEdit = (item: IncidentInvolved) => {
    setEditorMode("edit");
    setForm(toFormState(item));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = () => {
    toast.info(WRITE_NOT_CONNECTED_MESSAGE);
  };

  const submitLabel =
    editorMode === "create" ? "Agregar" : "Guardar cambios";

  return (
    <Dialog open={open} onOpenChange={(nextOpen: boolean) => !nextOpen && onClose()}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl">Personal involucrado</DialogTitle>
              <DialogDescription className="sr-only">
                Gestiona el personal vinculado a la incidencia seleccionada.
              </DialogDescription>
              <p className="text-sm text-muted-foreground">Incidencia #{incidentId}</p>
            </div>

            <Button
              variant="destructive"
              className="mr-10 gap-2 font-medium"
              size="sm"
              type="button"
              onClick={handleSubmit}
            >
              <Plus size={14} />
              {submitLabel}
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 min-h-0 pr-1">
          <div className="space-y-4 pb-2">
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users size={14} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Registros de personal
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isLoading
                      ? "Cargando registros..."
                      : `${personnel.length} registros`}
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-36 w-full rounded-[24px]" />
                  <Skeleton className="h-36 w-full rounded-[24px]" />
                </div>
              ) : personnel.length === 0 ? (
                <div className="rounded-[24px] border-2 border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                  No hay personal involucrado registrado.
                </div>
              ) : (
                personnel.map((item) => (
                  <IncidentPersonnelCard
                    key={item.id}
                    item={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </section>

            <div ref={formRef}>
              <IncidentPersonnelForm form={form} onFormChange={setForm} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
