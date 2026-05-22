import type { User } from "@/security/session/interfaces/user";

export interface LogInResponse {
  message: string;
  token: string;
  user: User;
  nombre: string;
  apellidos: string;
  nuevo: "no" | "si";
}
