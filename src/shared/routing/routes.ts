import DashboardClientPage from "@/dashboard/pages/DashboardClientPage";
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

const QuotationNavigation = lazy(
  () => import("@/cotizacion/routing/Navigation"),
);

//Order matters since it defines hierarchy, this hierarchy makes the routing work properly
export const routes: IRoute[] = [
  {
    path: "/intranet/procesos/*",
    Component: ProcessNavigation,
    isPrivate: true,
  },
  {
    path: "/intranet/inventario/*",
    Component: InventoryNavigation,
    isPrivate: true,
  },
  {
    path: "/intranet/cotizaciones/*",
    Component: QuotationNavigation,
    isPrivate: true,
  },
  {
    path: "/intranet/solicitudes/*",
    Component: OrdersNavigation,
    isPrivate: true,
  },
  {
    path: "/intranet/dashboard/*",
    Component: DashboardClientPage,
    isPrivate: true,
  },
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
