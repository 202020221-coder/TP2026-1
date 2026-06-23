import type { IRoute } from "@/shared/interfaces/route";
import { ManageInformesPage } from "../pages/ManageInformes";
import { RolesRecord } from "@/security/session/enum/roles.enum";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: ManageInformesPage,
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
