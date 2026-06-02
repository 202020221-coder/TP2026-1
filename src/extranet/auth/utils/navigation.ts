import { RolesRecord } from "@/security/session/enum/roles.enum";

export function getDefaultRouteByRole(rol: string, nuevo?: string): string {
  switch (rol) {
    case RolesRecord.client:
      return nuevo === "si" ? "/intranet/solicitudes/crear" : "/intranet/solicitudes";
    case RolesRecord.manager:
    case RolesRecord.projectAdmin:
      return "/intranet/dashboard";
    case RolesRecord.fieldSupervisor:
    case RolesRecord.fieldWorker:
    case RolesRecord.lawyer:
    case RolesRecord.workshopWorker:
    default:
      return "/intranet/proyectos";
  }
}
