import type { IRoute } from "@/shared/interfaces/route";
import { PersonnelManagement } from "../pages";
import { RolesRecord } from "@/security/session/enum/roles.enum";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: PersonnelManagement,
    roles: [
      RolesRecord.projectAdmin,
      RolesRecord.manager,
      RolesRecord.lawyer,
      RolesRecord.fieldSupervisor,
      RolesRecord.fieldWorker,
    ],
    isPrivate: true,
  },
];
