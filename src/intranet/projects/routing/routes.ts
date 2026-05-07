import type { IRoute } from "@/shared/interfaces/route";
import { ProjectsManagementPage } from "../pages/ManageProjects";
import { RolesRecord } from "@/security/session/enum/roles.enum";
export const routes: IRoute[] = [
  {
    path: "/",
    Component: ProjectsManagementPage,
    isPrivate: true,
    roles: [RolesRecord.manager],
  },
];
