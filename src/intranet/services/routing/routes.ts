import type { IRoute } from "@/shared/interfaces/route";
import ListServiciosPage from "../pages/ListServiciosPage";
import { RolesRecord } from "@/security/session/enum/roles.enum";

export const routes: IRoute[] = [
  {
    path: "/", 
    Component: ListServiciosPage,
    isPrivate: true,  //private sirve si es accedible si es para inciar sesión
    roles: [RolesRecord.projectAdmin , RolesRecord.manager],  //escoges que roles pueden ver
  },
];
