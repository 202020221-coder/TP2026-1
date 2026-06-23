import type { IRoute } from "@/shared/interfaces/route";
import { IncidentsManagementPage } from "../pages/ManageIncidents";
import { IncidentDetailPage } from "../pages/IncidentDetailPage";
import { RolesRecord } from "@/security/session/enum/roles.enum";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: IncidentsManagementPage,
    isPrivate: true,
    roles: [
      RolesRecord.manager,
      RolesRecord.projectAdmin,
      RolesRecord.lawyer,
      RolesRecord.fieldSupervisor,
      RolesRecord.fieldWorker,
      RolesRecord.workshopWorker,
    ],
  },
  {
    path: "/:id",
    Component: IncidentDetailPage,
    isPrivate: true,
    roles: [
      RolesRecord.manager,
      RolesRecord.projectAdmin,
      RolesRecord.lawyer,
      RolesRecord.fieldSupervisor,
      RolesRecord.fieldWorker,
      RolesRecord.workshopWorker,
    ],
  },
];
