import type { IRoute } from "@/shared/interfaces/route";
import DashboardClientPage from "../pages/DashboardClientPage";
import { RolesRecord } from "@/security/session/enum/roles.enum";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: DashboardClientPage,
    isPrivate: true,
    roles: [
      RolesRecord.client,
      RolesRecord.fieldSupervisor,
      RolesRecord.projectAdmin,
      RolesRecord.manager,
    ],
  },
];
