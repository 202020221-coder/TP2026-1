import { z } from "zod";
import { format, addDays } from "date-fns";

export const ServiceFormItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  unitPrice: z.number().min(0.01, "El precio debe ser mayor a 0"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  dueDate: z.string().min(1, "La fecha de vencimiento es requerida"),
  schedule: z.string().min(1, "La jornada es requerida"),
});

export const AddServicesFormSchema = z.object({
  items: z
    .array(ServiceFormItemSchema)
    .min(1, "Seleccione al menos un servicio"),
});

export type ServiceFormItemType = z.infer<typeof ServiceFormItemSchema>;
export type AddServicesFormType = z.infer<typeof AddServicesFormSchema>;

export const defaultServiceFormItem = (
  overrides?: Partial<ServiceFormItemType>,
): ServiceFormItemType => ({
  id: "",
  name: "",
  unitPrice: 0,
  startDate: format(new Date(), "yyyy-MM-dd"),
  dueDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
  schedule: "",
  ...overrides,
});
