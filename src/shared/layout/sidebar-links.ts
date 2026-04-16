// import { ValidRoles } from '../interfaces'

export interface IMenu {
  title: string;
  url?: string;
  roles: string[];
  items?: ISubMenu[];
  icon?: string;
}

export interface ISubMenu {
  title: string;
  url: string;
  roles: string[];
}

export const sidebarLinks: IMenu[] = [
  {
    title: "Dashboard",
    roles: ["cliente"],
    url: "/intranet/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Mis Solicitudes",
    roles: ["cliente"],
    url: "/intranet/solicitudes/mis-solicitudes",
    icon: "ClipboardList",
  },
  {
    title: "Mis Cotizaciones",
    roles: ["cliente"],
    url: "/intranet/cotizaciones/mis-cotizaciones",
    icon: "Receipt",
  },
  {
    title: "Mis Servicios",
    roles: ["cliente"],
    url: "/intranet/servicios/mis-servicios",
    icon: "BriefcaseBusiness",
  },
];
