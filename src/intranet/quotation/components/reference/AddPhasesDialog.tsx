import { useState, useEffect, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Layers,
  ListChecks,
  GripVertical,
  Trash2,
} from "lucide-react";
import {
  useFieldArray,
  useForm,
  Controller,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddPhasesFormSchema,
  type AddPhasesFormType,
  type PhaseFormItemType,
} from "../../schemas/addPhases";
import type { QuotationPhase } from "../../interfaces/phases.types";

let nextId = 1;
const genId = () => `phase_${nextId++}_${Date.now()}`;

const defaultPhaseItem = (
  overrides?: Partial<PhaseFormItemType>,
): PhaseFormItemType => ({
  id: genId(),
  name: "",
  description: "",
  duration: 1,
  activities: [],
  ...overrides,
});

interface AddPhasesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (items: QuotationPhase[]) => void;
  existingPhases: QuotationPhase[];
}

export const AddPhasesDialog: FC<AddPhasesDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  existingPhases,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPhasesFormType>({
    resolver: zodResolver(AddPhasesFormSchema),
    defaultValues: { items: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (open) {
      if (existingPhases.length > 0) {
        reset({
          items: existingPhases.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            duration: p.duration,
            activities: p.activities.map((a) => ({
              id: a.id,
              name: a.name,
            })),
          })),
        });
      } else {
        reset({ items: [] });
      }
    }
  }, [open, existingPhases, reset]);

  const handleAddPhase = () => {
    append(defaultPhaseItem());
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const onSubmit = (data: AddPhasesFormType) => {
    const phases: QuotationPhase[] = data.items.map((p) => ({
      id: p.id,
      name: p.name.trim(),
      description: p.description.trim(),
      duration: p.duration,
      activities: p.activities
        .filter((a) => a.name.trim().length > 0)
        .map((a) => ({ id: a.id, name: a.name.trim() })),
    }));
    onConfirm(phases);
    onOpenChange(false);
  };

  const hasItems = fields.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] min-w-11/12 max-w-3xl flex-col gap-0 p-0">
        <DialogHeader className="border-b border-border px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Layers className="h-5 w-5 text-primary" />
            Agregar Fases
          </DialogTitle>
          <DialogDescription>
            Define las fases del proyecto, sus descripciones, duración y las
            actividades que las conforman.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6 py-4 min-h-0">
          {!hasItems && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-12 text-center">
              <div className="rounded-full bg-muted p-3">
                <Layers className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Aún no hay fases agregadas.
              </p>
              <Button variant="outline" size="sm" onClick={handleAddPhase}>
                <Plus className="h-4 w-4" />
                Agregar primera fase
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((phaseField, phaseIndex) => (
              <PhaseFormCard
                key={phaseField.id}
                control={control}
                phaseIndex={phaseIndex}
                totalPhases={fields.length}
                onRemove={() => remove(phaseIndex)}
                errors={errors.items?.[phaseIndex]}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPhase}
          >
            <Plus className="h-4 w-4" />
            Agregar fase
          </Button>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!hasItems}
            >
              Confirmar fases ({fields.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PhaseFormCardProps {
  control: Control<AddPhasesFormType>;
  phaseIndex: number;
  totalPhases: number;
  onRemove: () => void;
  errors?: FieldErrors<PhaseFormItemType>;
}

const PhaseFormCard: FC<PhaseFormCardProps> = ({
  control,
  phaseIndex,
  totalPhases,
  onRemove,
  errors,
}) => {
  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
    swap,
  } = useFieldArray({
    control,
    name: `items.${phaseIndex}.activities`,
  });

  const [newActivityName, setNewActivityName] = useState("");

  const handleAddActivity = () => {
    const trimmed = newActivityName.trim();
    if (!trimmed) return;
    appendActivity({ id: genId(), name: trimmed });
    setNewActivityName("");
  };

  const handleActivityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddActivity();
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-none">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {phaseIndex + 1}
        </span>
        <div className="flex-1 space-y-2">
          <Controller
            control={control}
            name={`items.${phaseIndex}.name`}
            render={({ field }) => (
              <Input
                placeholder="Nombre de la fase"
                value={field.value}
                onChange={field.onChange}
                className="h-9 font-medium"
              />
            )}
          />
          {errors?.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
          <Controller
            control={control}
            name={`items.${phaseIndex}.description`}
            render={({ field }) => (
              <Textarea
                placeholder="Descripción breve de la fase (opcional)"
                value={field.value ?? ""}
                onChange={field.onChange}
                className="min-h-[60px] resize-none text-sm"
              />
            )}
          />
          <Controller
            control={control}
            name={`items.${phaseIndex}.duration`}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground shrink-0">
                  Duración:
                </label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="h-8 w-20 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">días</span>
                </div>
              </div>
            )}
          />
          {errors?.duration && (
            <p className="text-xs text-destructive">
              {errors.duration.message}
            </p>
          )}
        </div>
        {totalPhases > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="ml-9 space-y-2">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Actividades
          </span>
          <span className="text-xs text-muted-foreground/60">
            ({activityFields.length})
          </span>
        </div>
        {errors?.activities && !Array.isArray(errors.activities) && errors.activities.message && (
          <p className="text-xs text-destructive">
            {errors.activities.message}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Input
            placeholder="Escribe una actividad y presiona Enter"
            value={newActivityName}
            onChange={(e) => setNewActivityName(e.target.value)}
            onKeyDown={handleActivityKeyDown}
            className="h-8 text-sm"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddActivity}
            disabled={!newActivityName.trim()}
            className="h-8 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar
          </Button>
        </div>

        {activityFields.length > 0 && (
          <div className="space-y-1">
            {activityFields.map((actField, actIndex) => (
              <ActivityItem
                key={actField.id}
                control={control}
                phaseIndex={phaseIndex}
                actIndex={actIndex}
                totalActivities={activityFields.length}
                onRemove={() => removeActivity(actIndex)}
                onMoveUp={() => {
                  if (actIndex > 0) swap(actIndex, actIndex - 1);
                }}
                onMoveDown={() => {
                  if (actIndex < activityFields.length - 1)
                    swap(actIndex, actIndex + 1);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ActivityItemProps {
  control: Control<AddPhasesFormType>;
  phaseIndex: number;
  actIndex: number;
  totalActivities: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const ActivityItem: FC<ActivityItemProps> = ({
  control,
  phaseIndex,
  actIndex,
  totalActivities,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => (
  <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-2 py-1.5">
    <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
    <Controller
      control={control}
      name={`items.${phaseIndex}.activities.${actIndex}.name`}
      render={({ field }) => (
        <Input
          placeholder="Nombre de la actividad"
          value={field.value}
          onChange={field.onChange}
          className="h-7 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
        />
      )}
    />
    <div className="flex items-center gap-0.5">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onMoveUp}
        disabled={actIndex === 0}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onMoveDown}
        disabled={actIndex === totalActivities - 1}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
);
