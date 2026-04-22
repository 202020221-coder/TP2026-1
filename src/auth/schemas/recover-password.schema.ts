import { z } from "zod";

export const recoverPasswordEmailFormSchema = z.object({
  email: z.email("Por favor ingrese un correo electrónico válido."),
});

export type RecoverPasswordEmailFormValues = z.infer<
  typeof recoverPasswordEmailFormSchema
>;

export const recoverPasswordCodeFormSchema = z.object({
  code: z.string().min(1, "Ingrese un código válido"),
});

export type RecoverPasswordCodeFormValues = z.infer<
  typeof recoverPasswordCodeFormSchema
>;

export const newPasswordFormSchema = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,12}$/,
        "Siga las instrucciones para la creación de la nueva contraseña.",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordFormSchema>;
