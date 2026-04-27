import type { IRoute } from "@/shared/interfaces/route";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import TruckInventoryPage from "../pages/truck-inventory";
import ListTrucksPage from "../pages/ListTrucksPage";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListTrucksPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin],
  },
  {
    path: "/inventory/:placa",
    Component: TruckInventoryPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin],
  },
];
