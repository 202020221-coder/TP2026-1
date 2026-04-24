import type { IRoute } from "@/shared/interfaces/route";
import {
  GestionarInventario,
  GestionarCamiones,
  InventarioCamiones,
} from "../pages";
import { RolesRecord } from "../../../security/session/enum/roles.enum";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: GestionarInventario,
    roles: [RolesRecord.projectAdmin],
    isPrivate: true,
  },
  {
    path: "camiones",
    Component: InventarioCamiones,
    roles: [RolesRecord.projectAdmin],
    isPrivate: true,
  },
  {
    path: "/camiones/gestionar",
    Component: GestionarCamiones,
    roles: [RolesRecord.projectAdmin],
    isPrivate: true,
  },
];
