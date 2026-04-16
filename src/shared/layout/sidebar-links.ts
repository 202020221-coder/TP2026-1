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
    title: "Solicitudes",
    roles: ["cliente"],
    url: "/intranet/solicitudes/",
    icon: "ClipboardList",
  },
  {
    title: "Cotizaciones",
    roles: ["cliente"],
    url: "/intranet/cotizaciones/",
    icon: "Receipt",
  },
  {
    title: "Servicios",
    roles: ["cliente"],
    url: "/intranet/servicios/mis-servicios",
    icon: "BriefcaseBusiness",
  },
];
