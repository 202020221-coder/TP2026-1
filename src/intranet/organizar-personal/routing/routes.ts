import type { IRoute } from "@/shared/interfaces/route";
import { lazy } from "react";

const OrganizarPersonalPage = lazy(
  () => import("../pages/OrganizarPersonalPage"),
);

export const routes: IRoute[] = [
  {
    path: "/",
    Component: OrganizarPersonalPage,
    isPrivate: true,
  },
];
