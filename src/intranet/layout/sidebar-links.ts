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
    roles: ["ADMIN", "CLIENT"],
    url: "/intranet/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Solicitudes",
    roles: ["ADMIN"],
    url: "/intranet/solicitudes/",
    icon: "ClipboardList",
  },
  {
    title: "Cotizaciones",
    roles: ["ADMIN"],
    url: "/intranet/cotizaciones/",
    icon: "Receipt",
  },
  {
    title: "Servicios",
    roles: ["ADMIN"],
    url: "/intranet/servicios/servicios",
    icon: "BriefcaseBusiness",
  },
];
