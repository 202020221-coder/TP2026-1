import type { IRoute } from "@/shared/interfaces/route";
import { lazy } from "react";
import { RolesRecord } from "@/security/session/enum/roles.enum";

const OrganizarPersonalPage = lazy(
  () => import("../pages/OrganizarPersonalPage"),
);

export const routes: IRoute[] = [
  {
    path: "/:idProyecto",
    Component: OrganizarPersonalPage,
    isPrivate: true,
    roles: [
      RolesRecord.projectAdmin,
      RolesRecord.manager,
      RolesRecord.lawyer,
      RolesRecord.fieldSupervisor,
      RolesRecord.fieldWorker,
    ],
  },
];
