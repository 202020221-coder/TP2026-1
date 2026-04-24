import type { IRoute } from "@/shared/interfaces/route";
import { lazy } from "react";

const ExtranetNavigation = lazy(() => import("@/extranet/routing/Navigation"));
const IntranetNavigation = lazy(() => import("@/intranet/routing/Navigation"));

export const routes: IRoute[] = [
  {
    path: "/intranet/*",
    Component: IntranetNavigation,
    isPrivate: true,
  },
  {
    path: "/*",
    Component: ExtranetNavigation,
    isPrivate: false,
  },
];
