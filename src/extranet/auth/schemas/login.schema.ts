import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Por favor ingrese un correo electronico válido."),
  password: z.string(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
