import { z } from "zod";

const peruPhoneRegex = /^\d{7,9}$/;
const dniRegex = /^\d{8}$/;
const rucRegex = /^\d{11}$/;

export const clientTypeSchema = z.enum(["jurídica", "física"], {
  error: "Seleccione un tipo de cliente.",
});

export const clientDataSchema = z.object({
  nameOrBusinessName: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres requeridos")
    .max(100, "Máximo 100 caracteres permitidos"),

  lastName: z
    .string()
    .trim()
    .max(50, "Máximo 50 caracteres permitidos")
    .optional()
    .or(z.literal("")),

  documentNumber: z
    .string()
    .trim()
    .refine(
      (val) => dniRegex.test(val) || rucRegex.test(val),
      "DNI debe tener 8 dígitos o RUC debe tener 11 dígitos",
    ),

  email: z
    .string()
    .trim()
    .email("Correo electrónico inválido")
    .max(100, "Máximo 100 caracteres permitidos"),

  phone: z
    .string()
    .trim()
    .regex(peruPhoneRegex, "Teléfono debe tener 7 a 9 dígitos")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(250, "Máximo 250 caracteres permitidos")
    .optional()
    .or(z.literal("")),
});

export const createClientStepSchema = z
  .object({
    clientType: clientTypeSchema,
    clientData: clientDataSchema,
  })
  .superRefine(({ clientType, clientData }, ctx) => {
    const isRuc = rucRegex.test(clientData.documentNumber);
    const isDni = dniRegex.test(clientData.documentNumber);

    if (clientType === "jurídica" && !isRuc) {
      ctx.addIssue({
        code: "custom",
        path: ["clientData", "documentNumber"],
        message: "Para cliente jurídica, el documento debe ser RUC (11 dígitos).",
      });
    }

    if (clientType === "física" && !isDni) {
      ctx.addIssue({
        code: "custom",
        path: ["clientData", "documentNumber"],
        message: "Para cliente física, el documento debe ser DNI (8 dígitos).",
      });
    }

    if (clientType === "física" && !clientData.lastName?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["clientData", "lastName"],
        message: "El apellido es obligatorio para cliente física.",
      });
    }
  });

export const requesterDataSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres requeridos")
    .max(50, "Máximo 50 caracteres permitidos"),

  lastName: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres requeridos")
    .max(50, "Máximo 50 caracteres permitidos"),

  dni: z
    .string()
    .trim()
    .regex(dniRegex, "DNI debe tener 8 dígitos"),

  email: z.string().trim().email("Correo electrónico inválido"),

  phone: z
    .string()
    .trim()
    .regex(peruPhoneRegex, "Teléfono debe tener 7 a 9 dígitos"),

  workAddress: z
    .string()
    .trim()
    .max(250, "Máximo 250 caracteres permitidos")
    .optional()
    .or(z.literal("")),

  position: z
    .string()
    .trim()
    .max(50, "Máximo 50 caracteres permitidos")
    .optional()
    .or(z.literal("")),
});

export const serviceDataSchema = z
  .object({
    serviceDescription: z
      .string()
      .trim()
      .min(20, "Describa con más detalle (mínimo 20 caracteres)")
      .max(1000, "Máximo 1000 caracteres permitidos"),

    serviceAddress: z
      .string()
      .trim()
      .min(10, "Mínimo 10 caracteres requeridos")
      .max(250, "Máximo 250 caracteres permitidos"),

    projectStartDate: z.string().min(1, "Ingrese la fecha de inicio"),

    projectEndDate: z.string().min(1, "Ingrese la fecha de fin"),

    hoursPerDay: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (!val) return true;
        const num = Number(val);
        return Number.isInteger(num) && num >= 1 && num <= 24;
      }, "Horas por día debe estar entre 1 y 24"),
  })
  .refine(
    (data) => new Date(data.projectEndDate) >= new Date(data.projectStartDate),
    {
      message: "Fecha de fin debe ser posterior o igual a la fecha de inicio",
      path: ["projectEndDate"],
    },
  );

export const selectedProductSchema = z.object({
  id: z.string().min(1, "ID de selección inválido"),
  productId: z.string().min(1, "Producto inválido"),
  name: z.string().min(1, "Nombre de producto requerido"),
  category: z.string().optional(),
  intent: z.enum(["alquilar", "comprar"]),
  days: z.number().int().min(1).optional(),
  quantity: z.number().int().min(1, "La cantidad mínima es 1"),
});

export const selectedTruckSchema = z.object({
  id: z.string().min(1, "ID de selección inválido"),
  truckId: z.string().min(1, "Camión inválido"),
  name: z.string().min(1, "Nombre de camión requerido"),
  intent: z.enum(["alquilar", "comprar"]),
  days: z.number().int().min(1).optional(),
  quantity: z.number().int().min(1, "La cantidad mínima es 1"),
});

export const selectedProductsSchema = z
  .array(selectedProductSchema)
  .min(1, "Seleccione al menos un producto del catálogo")
  .superRefine((items, ctx) => {
    items.forEach((item, index) => {
      if (item.intent === "alquilar" && !item.days) {
        ctx.addIssue({
          code: "custom",
          path: [index, "days"],
          message: "Los productos para alquilar deben tener días.",
        });
      }
    });
  });

export const selectedTrucksSchema = z
  .array(selectedTruckSchema)
  .min(1, "Seleccione al menos un camión")
  .superRefine((items, ctx) => {
    items.forEach((item, index) => {
      if (item.intent === "alquilar" && !item.days) {
        ctx.addIssue({
          code: "custom",
          path: [index, "days"],
          message: "Los camiones para alquilar deben tener días.",
        });
      }
    });
  });

export const preferencesDataSchema = z.object({
  generalObservations: z
    .string()
    .max(500, "Máximo 500 caracteres permitidos")
    .optional()
    .or(z.literal("")),

  selectionObservations: z
    .string()
    .max(500, "Máximo 500 caracteres permitidos")
    .optional()
    .or(z.literal("")),
});

export const createRequestSchema = z.object({
  clientType: clientTypeSchema,
  formData: clientDataSchema,
  requesterData: requesterDataSchema,
  serviceData: serviceDataSchema,
  selectedProducts: selectedProductsSchema,
  selectedTrucks: selectedTrucksSchema,
  preferencesData: preferencesDataSchema,
});

export type ClientType = z.infer<typeof clientTypeSchema>;
export type ClientData = z.infer<typeof clientDataSchema>;
export type CreateClientStepData = z.infer<typeof createClientStepSchema>;
export type RequesterData = z.infer<typeof requesterDataSchema>;
export type ServiceData = z.infer<typeof serviceDataSchema>;
export type SelectedProduct = z.infer<typeof selectedProductSchema>;
export type SelectedTruck = z.infer<typeof selectedTruckSchema>;
export type PreferencesData = z.infer<typeof preferencesDataSchema>;
export type CreateRequestData = z.infer<typeof createRequestSchema>;
