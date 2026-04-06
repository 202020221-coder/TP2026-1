import type { IRoute } from "@/shared/interfaces/route";
import { lazy } from "react";

const HomeNavigation = lazy(() => import("@/home/routing/Navigation"));
// const AuthNavigation = lazy(()=>)
//const ProfileNavigation
const ProcessNavigation = lazy(
  () => import("@/procesos/routing/ProcessNavigation"),
);
const InventoryNavigation = lazy(
  () => import("@/Inventario/routing/InventoryNavigation"),
);

const AuthNavigation = lazy(()=>import("@/auth/routing/navigation"))
export const routes: IRoute[] = [
  {
    path: "*",
    Component: HomeNavigation,
  },
  {
    path: "/intranet/procesos/*",
    Component: ProcessNavigation,
  },
  {
    path: "/intranet/inventario/*",
    Component: InventoryNavigation,
  },
  {
    path: "/auth/*",
    Component: AuthNavigation
  }
];
