import type { UserRole } from "./roles";

export interface User {
  idusuario: number;
  dni_perfil: string;
  correo: string;
  telefono_contacto?: string;
  rol: UserRole;
  nuevo:boolean;
  nombres:string;
  apellidos:string;
}
