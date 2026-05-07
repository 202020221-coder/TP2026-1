import type { IRoute } from "@/shared/interfaces/route";
import { lazy } from "react";

const ServicesNavigation = lazy(
  () =>import("@/intranet/services/routing/Navigation"),
)
const DashboardNavigation = lazy(
  () => import("@/intranet/dashboard/routing/Navigation"),
);
const PersonnelNavigation = lazy(
  () => import("@/intranet/personnel/routing/Navigation"),
);
const InventoryNavigation = lazy(
  () => import("@/intranet/inventory/routing/Navigation"),
);
// const OrdersNavigation = lazy(() => import("@/intranet/orders/routing/Navigation"));

const RequestNavigation = lazy(
  () => import("@/intranet/request/routing/Navigation"),
);
const QuotationNavigation = lazy(
  () => import("@/intranet/quotation/routing/Navigation"),
);
const OrganizarPersonalNavigation = lazy(
  () => import("@/intranet/organizar-personal/routing/Navigation"),
);
const TrucksNavigation = lazy(() => import("@/intranet/trucks/routing/Navigation"));
const OrganizarRecursosNavigation = lazy(
  () => import("@/intranet/organizar-recursos/routing/Navigation"),
);

const ProjectNavigation = lazy(
  () => import("@/intranet/projects/routing/Navigation"),
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
    path: "/trucks/*",
    Component: TrucksNavigation,
    isPrivate: true,
  },
  {
    path: "/solicitudes/*",
    Component: RequestNavigation,
    isPrivate: true,
  },
  {
    path: "/organizar-personal/*",
    Component: OrganizarPersonalNavigation,
    isPrivate: true,
  },
  {
    path: "/organizar-recursos/*",
    Component: OrganizarRecursosNavigation,
    isPrivate: true,
  },
  {
    path: "/dashboard/*",
    Component: DashboardNavigation,
    isPrivate: true,
  },

  {
    path: "/servicio/*",
    Component: ServicesNavigation,
    isPrivate: true,
  },
  {
    path: "/proyectos/*",
    Component: ProjectNavigation,
    isPrivate: true,
  },
];
