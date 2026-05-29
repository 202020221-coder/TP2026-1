// import { ValidRoles } from '../interfaces'

import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";

export interface IMenu {
  title: string;
  url?: string;
  roles: UserRole[];
  items?: ISubMenu[];
  icon?: string;
}

export interface ISubMenu {
  title: string;
  url: string;
  roles: UserRole[];
}

export const sidebarLinks: IMenu[] = [
  {
    title: "Dashboard",
    roles: [RolesRecord.projectAdmin, RolesRecord.manager],
    url: "/intranet/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Solicitudes",
    roles: [RolesRecord.client, RolesRecord.projectAdmin, RolesRecord.manager, RolesRecord.fieldWorker],
    url: "/intranet/solicitudes/",
    icon: "ClipboardList",
  },
  {
    title: "Cotizaciones",
    roles: [RolesRecord.client, RolesRecord.projectAdmin, RolesRecord.manager],
    url: "/intranet/cotizaciones/",
    icon: "Receipt",
  },
  {
    title: "Camiones",
    roles: [RolesRecord.projectAdmin, RolesRecord.manager],
    url: "/intranet/trucks",
    icon: "Truck",
  },
  {
    title: "Servicios",
    roles: [RolesRecord.projectAdmin, RolesRecord.manager],
    url: "/intranet/servicios/",
    icon: "BriefcaseBusiness",
  },
  {
    title: "Personal",
    roles: [RolesRecord.projectAdmin, RolesRecord.manager],
    url: "/intranet/personal/",
    icon: "Users",
  },
  {
    title: "Inventario",
    roles: [RolesRecord.projectAdmin, RolesRecord.manager],
    url: "/intranet/inventario/",
    icon: "FileArchive",
  },
  {
    title: "Organizar Personal",
    roles: [RolesRecord.projectAdmin, RolesRecord.manager],
    url: "/intranet/organizar-personal/",
    icon: "CalendarDays",
  },
  {
    title: "Proyectos",
    roles: [RolesRecord.manager, RolesRecord.projectAdmin, RolesRecord.client, RolesRecord.lawyer, RolesRecord.fieldSupervisor],
    url: "/intranet/proyectos/",
    icon: "BriefcaseBusiness",
  },
  {
    title: "Informes",
    roles: [RolesRecord.lawyer, RolesRecord.fieldSupervisor],
    // aun no hay
    icon: "FileText",
  },
  {
    title: "Ver Incidencias",
    roles: [RolesRecord.projectAdmin, RolesRecord.manager, RolesRecord.lawyer, RolesRecord.fieldSupervisor],
    url: "/intranet/organizar-recursos/",
    icon: "ClipboardList",
  },
  {
    title: "Presupuesto Interno",
    roles: [RolesRecord.manager],
    // aun no hay
    icon: "FileText",
  },
];
