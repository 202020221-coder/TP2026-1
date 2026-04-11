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

const OrdersNavigation = lazy(() => import("@/solicitudes/routing/Navigation"));

const AuthNavigation = lazy(() => import("@/auth/routing/AuthNavigation"));
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
    path: "/intranet/solicitudes/*",
    Component: OrdersNavigation,//navegacion de solicitudes
  },
  {
    path: "/auth/*",
    Component: AuthNavigation,
  },
];
