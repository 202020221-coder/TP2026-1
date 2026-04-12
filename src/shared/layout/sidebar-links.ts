// import { ValidRoles } from '../interfaces'

export interface IMenu {
  title: string;
  url?: string;
  roles: string[];
  items?: ISubMenu[];
  icon?: React.ReactNode;
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
    url: "/dashboard",
  },
  {
    title: "Mis Solicitudes",
    roles: ["cliente"],
    url: "/solicitudes",
  },
  {
    title: "Mis Cotizaciones",
    roles: ["cliente"],
    url: "/cotizaciones",
  },
  {
    title: "Mis Servicios",
    roles: ["cliente"],
    url: "/servicios",
  },
];
