import type { IRoute } from "@/shared/interfaces/route";
import ListOrdersPage from "../pages/ListOrdersPage";
import { RolesRecord } from "@/security/session/enum/roles.enum";
//Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListOrdersPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin, RolesRecord.client, RolesRecord.manager, RolesRecord.fieldWorker],
  },
];
