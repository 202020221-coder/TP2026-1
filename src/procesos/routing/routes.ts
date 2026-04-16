import type { IRoute } from "@/shared/interfaces/route";
import { GestionarPersonal } from "../pages";
import { RolesRecord } from "@/profile/enum/roles.enum";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: GestionarPersonal,
    roles: [RolesRecord.projectAdmin],
    isPrivate: true,
  },
];
