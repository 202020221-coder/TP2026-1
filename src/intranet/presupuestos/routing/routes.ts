import { lazy } from "react";
import type { IRoute } from "@/shared/interfaces/route";
import { RolesRecord } from "@/security/session/enum/roles.enum";

const PresupuestosPage = lazy(() =>
  import("../pages/PresupuestosPage").then((m) => ({ default: m.PresupuestosPage }))
);

export const routes: IRoute[] = [
  {
    path: "/",
    Component: PresupuestosPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin, RolesRecord.manager],
  },
];
