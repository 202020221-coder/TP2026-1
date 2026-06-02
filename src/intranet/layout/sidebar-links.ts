// import { ValidRoles } from '../interfaces'

import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";

const hasRole = (
  role: UserRole | null | undefined,
  allowedRoles: readonly UserRole[],
) => !!role && allowedRoles.includes(role);

export const projectEditableRoles = [
  RolesRecord.projectAdmin,
  RolesRecord.manager,
] as const;

export const personnelEditableRoles = [
  RolesRecord.projectAdmin,
  RolesRecord.manager,
  RolesRecord.lawyer,
] as const;

export const resourceEditableRoles = [
  RolesRecord.lawyer,
  RolesRecord.manager,
  RolesRecord.projectAdmin,
  RolesRecord.fieldSupervisor,
] as const;




export const canEditProjects = (role: UserRole | null | undefined) =>
  hasRole(role, projectEditableRoles);

export const canEditPersonnel = (role: UserRole | null | undefined) =>
  hasRole(role, personnelEditableRoles);

export const canEditResources = (role: UserRole | null | undefined) =>
  hasRole(role, resourceEditableRoles);

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
    roles: [
      RolesRecord.client,
      RolesRecord.projectAdmin,
      RolesRecord.manager,
      RolesRecord.fieldWorker,
    ],
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
    title: "Gestionar Trabajadores",
    roles: [
      RolesRecord.projectAdmin,
      RolesRecord.manager,
      RolesRecord.lawyer,
      RolesRecord.fieldSupervisor,
      RolesRecord.fieldWorker,
    ],
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
    title: "Gestionar Proyectos",
    roles: [
      RolesRecord.projectAdmin,
      RolesRecord.manager,
      RolesRecord.lawyer,
      RolesRecord.fieldSupervisor,
      RolesRecord.fieldWorker,
      RolesRecord.client,
    ],
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
    title: "Gestionar Incidencia",
    roles: [
      RolesRecord.projectAdmin,
      RolesRecord.manager,
      RolesRecord.fieldSupervisor,
      RolesRecord.fieldWorker,
    ],
    url: "/intranet/incidencias/",
    icon: "ClipboardList",
  },
  {
    title: "Gestionar Recursos",
    roles: [RolesRecord.lawyer, RolesRecord.fieldSupervisor],
    url: "/intranet/organizar-recursos/",
    icon: "FileText",
  },
  {
    title: "Presupuesto Interno",
    roles: [RolesRecord.manager],
    // aun no hay
    icon: "FileText",
  },
];
