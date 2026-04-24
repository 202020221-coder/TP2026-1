import { z } from "zod";

export const SelectedInventoryItemSchema = z.object({
  idInventario: z.string(),
  idFabricante: z.string()
,  cantidad: z
    .number()
    .min(1, "Cantidad must be at least 1")
    .max(1000, "Cantidad cannot exceed 1000"),
  intencion: z
    .string()
    .min(1, "Intention is required")
    .max(200, "Intention cannot exceed 200 characters"),
  precio_unitario: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999, "Price is too high"),
  nombre: z.string(),
  precio_comercial: z.number(),
  estado: z.string()
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
