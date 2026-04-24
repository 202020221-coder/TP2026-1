import type { IRoute } from "@/shared/interfaces/route";
import ListOrdersPage from "../pages/ListOrdersPage";
import { CreateRequestPage } from "../pages/create-request/CreateRequestPage";
import { RolesRecord } from "@/security/session/enum/roles.enum";
// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    //TODO: Assure only one page for any role (already implemented here)
    path: "/",
    Component: ListOrdersPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin],
  },
  // Ingreso de cliente por primera vez
  {
    path: "/create-request",
    Component: CreateRequestPage,
    isPrivate: true,
    roles: [RolesRecord.client],
  },
];
