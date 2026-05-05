import { lazy } from "react";
import type { IRoute } from "@/shared/interfaces/route";

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
    roles: ["gerente", "administrador"],
  },
];
