import type { LogInResponse } from "../interfaces/responses.dto";
import { safeRequest } from "@/shared/api/safe-request";

export const LogIn = async (email: string, password: string) =>
  safeRequest<LogInResponse>({
    url: "/usuarios/login",
    data: { correo: email, contrasena: password },
    method: "POST"
  });
