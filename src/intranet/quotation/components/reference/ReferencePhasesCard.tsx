import { useState, type FC } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  Layers,
  Plus,
  ChevronDown,
  ChevronRight,
  ListChecks,
  GripVertical,
  FileText,
  Clock,
} from "lucide-react";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useQuotationReferenceStore } from "../../hooks/stores/quotation.reference.store.provider";
import { AddPhasesDialog } from "./AddPhasesDialog";
import { getProjectRange } from "../../lib/quotationSchedule";
import type { QuotationPhase } from "../../interfaces/phases.types";

interface ReferencePhasesCardProps {
  readOnly?: boolean;
}

export const ReferencePhasesCard: FC<ReferencePhasesCardProps> = ({
  readOnly = false,
}) => {
  const phases = useQuotationReferenceStore((s) => s.phases);
  const projectStartDate = useQuotationReferenceStore(
    (s) => s.projectStartDate,
  );
  const update = useQuotationReferenceStore((s) => s.update);
  const [dialogOpen, setDialogOpen] = useState(false);

  const projectRange = getProjectRange(projectStartDate, phases);
  const projectEndLabel =
    phases.items.length > 0
      ? format(projectRange.end, "yyyy-MM-dd")
      : projectStartDate;

  const handleConfirmPhases = (items: QuotationPhase[]) => {
    update("phases", { items });
  };

  const [openPhases, setOpenPhases] = useState<Set<string>>(new Set());

  const togglePhase = (id: string) => {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalActivities = phases.items.reduce(
    (acc, p) => acc + p.activities.length,
    0,
  );

  const totalDuration = phases.items.reduce(
    (acc, p) => acc + p.duration,
    0,
  );

  return (
    <>
      <div className="rounded-lg border bg-card shadow-none">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="flex items-center gap-1.5 text-lg font-medium text-foreground">
                <Layers className="h-5 w-5 text-primary" />
                Fases de la Cotización
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {readOnly
                  ? "Información de fases de la cotización."
                  : "Define las fases del proyecto, sus actividades y duración."}
              </p>
            </div>
            {!readOnly && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Agregar Fases
              </Button>
            )}
          </div>

          {/* Día de inicio del proyecto: ancla para calcular las fechas de cada
              etapa y de los servicios/subservicios de la cotización. */}
          <div className="mb-4 rounded-lg border border-border/60 bg-muted/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1.5">
                <Label
                  htmlFor="projectStartDate"
                  className="flex items-center gap-1.5 text-sm font-medium text-foreground"
                >
                  <CalendarClock className="h-4 w-4 text-primary" />
                  Día de inicio del servicio
                </Label>
                {readOnly ? (
                  <p className="text-sm text-foreground">{projectStartDate}</p>
                ) : (
                  <Input
                    id="projectStartDate"
                    type="date"
                    value={projectStartDate}
                    className="h-9 w-[200px] bg-background text-sm"
                    onChange={(e) =>
                      update("projectStartDate", e.target.value)
                    }
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  Desde esta fecha se calculan las etapas y las fechas de cada
                  servicio.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Fin estimado del proyecto
                </p>
                <p className="text-sm font-medium text-foreground">
                  {projectEndLabel}
                </p>
                <p className="text-xs text-muted-foreground">
                  {projectRange.days} día{projectRange.days !== 1 ? "s" : ""} en
                  total
                </p>
              </div>
            </div>
          </div>

          {phases.items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  <span>
                    {phases.items.length} fase
                    {phases.items.length !== 1 ? "s" : ""} ·{" "}
                    {totalActivities} actividad
                    {totalActivities !== 1 ? "es" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{totalDuration} días total</span>
                </div>
              </div>

              <div className="space-y-2">
                {phases.items.map((phase) => (
                  <Collapsible
                    key={phase.id}
                    open={openPhases.has(phase.id)}
                    onOpenChange={() => togglePhase(phase.id)}
                    className="rounded-lg border border-border/60 bg-muted/20"
                  >
                    <CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {phases.items.indexOf(phase) + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {phase.name}
                        </p>
                        {phase.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {phase.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-xs font-normal gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        {phase.duration} día{phase.duration !== 1 ? "s" : ""}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="shrink-0 text-xs font-normal"
                      >
                        {phase.activities.length} act.
                      </Badge>
                      {openPhases.has(phase.id) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t border-border/40 px-4 py-3 space-y-1.5">
                        {phase.description && (
                          <p className="text-xs text-muted-foreground mb-2 pb-2 border-b border-border/20">
                            {phase.description}
                          </p>
                        )}
                        {phase.activities.length > 0 ? (
                          phase.activities.map((activity, actIdx) => (
                            <div
                              key={activity.id}
                              className="flex items-center gap-2 rounded-md bg-background px-3 py-1.5 text-sm"
                            >
                              <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30" />
                              <span className="text-xs text-muted-foreground/60 w-4 shrink-0">
                                {actIdx + 1}.
                              </span>
                              <span className="text-foreground">
                                {activity.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground italic py-1">
                            Sin actividades definidas
                          </p>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          )}

          {phases.items.length === 0 && !readOnly && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-8 text-center">
              <div className="rounded-full bg-muted p-3">
                <Layers className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  No hay fases definidas
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Agrega fases al proyecto con sus actividades, descripciones y
                  duración.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Agregar fases
              </Button>
            </div>
          )}

          {phases.items.length === 0 && readOnly && (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-6 text-center">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No se definieron fases para esta cotización.
              </p>
            </div>
          )}
        </div>
      </div>

      <AddPhasesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmPhases}
        existingPhases={phases.items}
      />
    </>
  );
};
