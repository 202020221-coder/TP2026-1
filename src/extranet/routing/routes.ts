import type { IRoute } from "@/shared/interfaces/route";
import { lazy } from "react";

const HomeNavigation = lazy(() => import("@/extranet/home/routing/Navigation"));
const AuthNavigation = lazy(
  () => import("@/extranet/auth/routing/AuthNavigation"),
);
//Order matters since it defines hierarchy, this hierarchy makes the routing work properly
export const routes: IRoute[] = [
  {
    path: "/auth/*",
    Component: AuthNavigation,
    isPrivate: false,
  },
  {
    path: "/*",
    Component: HomeNavigation,
    isPrivate: false,
  },
];
