import type { IRoute } from "@/shared/interfaces/route";
import { GestionarPersonal } from "../pages";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: GestionarPersonal,
    roles: ["ADMIN"],
    isPrivate: true,
  },
];
