import { z } from "zod";

export const ActivityItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre de la actividad es requerido"),
});

export const PhaseFormItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre de la fase es requerido"),
  description: z.string(),
  duration: z.number().min(1, "La duración mínima es 1 día"),
  activities: z
    .array(ActivityItemSchema)
    .min(1, "Debe agregar al menos una actividad"),
});

export const AddPhasesFormSchema = z.object({
  items: z
    .array(PhaseFormItemSchema)
    .min(1, "Debe agregar al menos una fase"),
});

export type PhaseFormItemType = z.infer<typeof PhaseFormItemSchema>;
export type AddPhasesFormType = z.infer<typeof AddPhasesFormSchema>;
