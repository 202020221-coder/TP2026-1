import { z } from "zod";

export const SelectedInventoryItemSchema = z.object({
  idInventario: z.string(),
  cantidad: z
    .number()
    .min(1, "La cantidad debe ser mayor a 0"),
  intencion: z
    .string()
    .min(1, "Debe seleccionar la intención"),
  precio_unitario: z
    .number()
    .min(0.01, "El precio debe ser mayor a 0"),
  nombre: z.string(),
  precio_comercial: z.number(),
});

export const SelectInventoryFormSchema = z.object({
  items: z
    .array(SelectedInventoryItemSchema)
    .min(1, "At least one item must be selected"),
});

export type SelectedInventoryItemType = z.infer<
  typeof SelectedInventoryItemSchema
>;
export type SelectInventoryFormType = z.infer<typeof SelectInventoryFormSchema>;
