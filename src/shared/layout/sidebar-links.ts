// import { ValidRoles } from '../interfaces'

export interface IMenu {
  title: string;
  url?: string;
  roles: string[];
  items?: ISubMenu[];
}

export interface ISubMenu {
  title: string;
  url: string;
  roles: string[];
}

export const sidebarLinks: IMenu[] = [
  {
    title: "Gestion de Personal",
    roles: [],
    items: [
      {
        title: "Directorio",
        roles: [],
        url: "/directorio",
      },
    ],
  },
  {
    title: "Procesos",
    roles: [],
    items: [
      {
        title: "Gestion de Proyectos",
        roles: [],
        url: "/procesos",
      },
    ],
  },
  {
    title: "Inventario",
    roles: [],
    items: [
      {
        title: "Gestion de Inventario",
        roles: [],
        url: "/Inventario",
      },
      {
        title: "Inventario de Camiones",
        roles: [],
        url: "/inventario/camiones",
      },
      {
        title: "Gestion de Camiones",
        roles: [],
        url: "/inventario/gestionar-camiones",
      },
    ],
  },
];
