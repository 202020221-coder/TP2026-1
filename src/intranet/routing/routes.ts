import type { IRoute } from "@/shared/interfaces/route";
import { lazy } from "react";

const DashboardNavigation = lazy(
  () => import("@/intranet/dashboard/routing/Navigation"),
);
const ProcessNavigation = lazy(
  () => import("@/intranet/personnel/routing/Navigation"),
);
const InventoryNavigation = lazy(
  () => import("@/intranet/inventory/routing/Navigation"),
);
const OrdersNavigation = lazy(() => import("@/intranet/orders/routing/Navigation"));
const QuotationNavigation = lazy(
  () => import("@/intranet/quotation/routing/Navigation"),
);
const TrucksNavigation = lazy(() => import("@/intranet/trucks/routing/Navigation"));

//Order matters since it defines hierarchy, this hierarchy makes the routing work properly
export const routes: IRoute[] = [
  {
    path: "/procesos/*",
    Component: ProcessNavigation,
    isPrivate: true,
  },
  {
    path: "/inventario/*",
    Component: InventoryNavigation,
    isPrivate: true,
  },
  {
    path: "/cotizaciones/*",
    Component: QuotationNavigation,
    isPrivate: true,
  },
  {
    path: "/trucks/*",
    Component: TrucksNavigation,
    isPrivate: true,
  },
  {
    path: "/solicitudes/*",
    Component: OrdersNavigation,
    isPrivate: true,
  },
  {
    path: "/dashboard/*",
    Component: DashboardNavigation,
    isPrivate: true,
  },
];
