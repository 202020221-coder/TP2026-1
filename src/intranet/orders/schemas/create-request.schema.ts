import { z } from "zod";

const peruPhoneRegex = /^\d{7,9}$/;
const dniRegex = /^\d{8}$/;
const rucRegex = /^\d{11}$/;

export const clientDataSchema = z.object({
  nameOrBusinessName: z
    .string()
    .min(3, "Mínimo 3 caracteres requeridos")
    .max(100, "Máximo 100 caracteres permitidos")
    .regex(/^[a-zA-Z0-9\s\ñÑ.()-]*$/, "Caracteres inválidos"),

  lastName: z
    .string()
    .min(2, "Mínimo 2 caracteres requeridos")
    .max(50, "Máximo 50 caracteres permitidos")
    .regex(/^[a-zA-Z\s\ñÑ-]*$/, "Caracteres inválidos")
    .optional()
    .or(z.literal("")),

  documentNumber: z
    .string()
    .refine(
      (val) => dniRegex.test(val) || rucRegex.test(val),
      "DNI debe tener 8 dígitos o RUC debe tener 11 dígitos",
    ),

  email: z
    .string()
    .email("Correo electrónico inválido")
    .max(100, "Máximo 100 caracteres permitidos"),

  phone: z
    .string()
    .min(7, "Teléfono inválido")
    .regex(peruPhoneRegex, "Teléfono debe tener 7 a 9 dígitos")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .min(10, "Mínimo 10 caracteres requeridos")
    .max(250, "Máximo 250 caracteres permitidos")
    .optional()
    .or(z.literal("")),
});

export const requesterDataSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres requeridos")
    .max(50, "Máximo 50 caracteres permitidos")
    .regex(/^[a-zA-Z\s\ñÑ'-]*$/, "Caracteres inválidos"),

  lastName: z
    .string()
    .min(2, "Mínimo 2 caracteres requeridos")
    .max(50, "Máximo 50 caracteres permitidos")
    .regex(/^[a-zA-Z\s\ñÑ-]*$/, "Caracteres inválidos"),

  dni: z
    .string()
    .regex(dniRegex, "DNI debe tener 8 dígitos")
    .refine((val) => {
      const dniNum = parseInt(val);
      return dniNum >= 1000000 && dniNum <= 99999999;
    }, "DNI inválido"),

  email: z.string().email("Correo electrónico inválido"),

  phone: z
    .string()
    .min(7, "Teléfono inválido")
    .regex(peruPhoneRegex, "Teléfono debe tener 7 a 9 dígitos"),

  position: z
    .string()
    .min(3, "Mínimo 3 caracteres requeridos")
    .max(50, "Máximo 50 caracteres permitidos")
    .optional()
    .or(z.literal("")),

  workAddress: z
    .string()
    .min(10, "Mínimo 10 caracteres requeridos")
    .max(250, "Máximo 250 caracteres permitidos")
    .optional()
    .or(z.literal("")),
});

export const serviceDataSchema = z
  .object({
    serviceDescription: z
      .string()
      .min(20, "Describa con más detalle (mínimo 20 caracteres)")
      .max(1000, "Máximo 1000 caracteres permitidos"),

    serviceAddress: z
      .string()
      .min(10, "Mínimo 10 caracteres requeridos")
      .max(250, "Máximo 250 caracteres permitidos"),

    projectStartDate: z.string().refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Fecha de inicio debe ser hoy o posterior"),

    projectEndDate: z.string().refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      return date > new Date();
    }, "Fecha de fin debe ser posterior a la actual"),

    hoursPerDay: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (!val) return true;
        const num = parseInt(val);
        return num > 0 && num <= 24;
      }, "Horas por día debe estar entre 1 y 24"),
  })
  .refine(
    (data) => {
      if (data.projectStartDate && data.projectEndDate) {
        const start = new Date(data.projectStartDate);
        const end = new Date(data.projectEndDate);
        return end > start;
      }
      return true;
    },
    {
      message: "Fecha de fin debe ser posterior a la fecha de inicio",
      path: ["projectEndDate"],
    },
  );

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

export type ClientData = z.infer<typeof clientDataSchema>;
export type RequesterData = z.infer<typeof requesterDataSchema>;
export type ServiceData = z.infer<typeof serviceDataSchema>;
export type PreferencesData = z.infer<typeof preferencesDataSchema>;
