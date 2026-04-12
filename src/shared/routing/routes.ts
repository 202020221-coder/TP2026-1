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
export const routes: IRoute[] = [
  {
    path: "*",
    Component: HomeNavigation,
    isPrivate: false,
  },
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
    Component: OrdersNavigation, //navegacion de solicitudes
    isPrivate: true,
  },
  // {
  //   path: "/intranet/solicitud/*",
  //   Component: RequestNavigation,
  // },
  {
    path: "/auth/*",
    Component: AuthNavigation,
    isPrivate: false,
  },
];
