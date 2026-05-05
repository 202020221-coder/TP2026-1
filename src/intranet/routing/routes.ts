import type { IRoute } from "@/shared/interfaces/route";
import { lazy } from "react";

const DashboardNavigation = lazy(
  () => import("@/intranet/dashboard/routing/Navigation"),
);
const PersonnelNavigation = lazy(
  () => import("@/intranet/personnel/routing/Navigation"),
);
const InventoryNavigation = lazy(
  () => import("@/intranet/inventory/routing/Navigation"),
);
const OrdersNavigation = lazy(() => import("@/intranet/orders/routing/Navigation"));
const QuotationNavigation = lazy(
  () => import("@/intranet/quotation/routing/Navigation"),
);
const OrganizarPersonalNavigation = lazy(
  () => import("@/intranet/organizar-personal/routing/Navigation"),
);

//Order matters since it defines hierarchy, this hierarchy makes the routing work properly
export const routes: IRoute[] = [
  {
    path: "/personal/*",
    Component: PersonnelNavigation,
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
    path: "/solicitudes/*",
    Component: OrdersNavigation,
    isPrivate: true,
  },
  {
    path: "/organizar-personal/*",
    Component: OrganizarPersonalNavigation,
    isPrivate: true,
  },
  {
    path: "/dashboard/*",
    Component: DashboardNavigation,
    isPrivate: true,
  },
];
