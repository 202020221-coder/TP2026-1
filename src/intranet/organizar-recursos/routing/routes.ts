import { lazy } from "react";
import type { IRoute } from "@/shared/interfaces/route";
import { RolesRecord } from "@/security/session/enum/roles.enum";

const OrganizarRecursosPage = lazy(
  () =>
    import("../pages/OrganizarRecursosPage").then((module) => ({
      default: module.OrganizarRecursosPage,
    }))
);

export const routes: IRoute[] = [
  {
    path: "/",
    Component: OrganizarRecursosPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin, RolesRecord.manager],
  },
];
