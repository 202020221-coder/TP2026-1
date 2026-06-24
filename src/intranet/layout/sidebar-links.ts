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
  RolesRecord.fieldSupervisor,
] as const;

export const personnelViewRoles = [
  RolesRecord.projectAdmin,
  RolesRecord.manager,
  RolesRecord.lawyer,
  RolesRecord.workshopWorker,
] as const;

export const resourceEditableRoles = [
  RolesRecord.manager,
  RolesRecord.projectAdmin,
  RolesRecord.fieldSupervisor,
] as const;

export const incidentQuotationViewRoles = [
  RolesRecord.manager,
  RolesRecord.projectAdmin,
  RolesRecord.lawyer,
] as const;

export const financialAnalyticsHiddenRoles = [
  RolesRecord.fieldWorker,
  RolesRecord.workshopWorker,
  RolesRecord.fieldSupervisor,
] as const;

export const serviceDeactivateRoles = [
  RolesRecord.projectAdmin,
  RolesRecord.manager,
] as const;

export const canEditProjects = (role: UserRole | null | undefined) =>
  hasRole(role, projectEditableRoles);

export const canEditPersonnel = (role: UserRole | null | undefined) =>
  hasRole(role, personnelEditableRoles);

export const canViewPersonnel = (role: UserRole | null | undefined) =>
  hasRole(role, personnelViewRoles);

export const canEditResources = (role: UserRole | null | undefined) =>
  hasRole(role, resourceEditableRoles);

export const canViewIncidentQuotations = (role: UserRole | null | undefined) =>
  hasRole(role, incidentQuotationViewRoles);

export const hideFinancialsInAnalytics = (role: UserRole | null | undefined) =>
  hasRole(role, financialAnalyticsHiddenRoles);

/** Roles que solo ven duración real (sin días cotizados/planificados). */
export const hidePlannedDurationInAnalytics = hideFinancialsInAnalytics;

export const canAssignPersonnel = (role: UserRole | null | undefined) =>
  canEditPersonnel(role);

export const canCommentOnlyPersonnel = (role: UserRole | null | undefined) =>
  role === RolesRecord.lawyer;

export const canDeactivateServices = (role: UserRole | null | undefined) =>
  hasRole(role, serviceDeactivateRoles);

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
    roles: [
      RolesRecord.client,
      RolesRecord.fieldSupervisor,
      RolesRecord.projectAdmin,
      RolesRecord.manager,
    ],
    url: "/intranet/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Solicitudes",
    roles: [
      RolesRecord.client,
      RolesRecord.projectAdmin,
      RolesRecord.manager,
    ],
    url: "/intranet/solicitudes/",
    icon: "ClipboardList",
  },
  {
    title: "Cotizaciones",
    roles: [
      RolesRecord.client,
      RolesRecord.projectAdmin,
      RolesRecord.manager,
      RolesRecord.lawyer,
      RolesRecord.workshopWorker,
    ],
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
    icon: "Wrench",
  },
  {
    title: "Gestionar Trabajadores",
    roles: [
      RolesRecord.projectAdmin,
      RolesRecord.manager,
      RolesRecord.lawyer,
      RolesRecord.workshopWorker,
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
    roles: [
      RolesRecord.projectAdmin,
      RolesRecord.manager,
      RolesRecord.fieldSupervisor,
      RolesRecord.fieldWorker,
    ],
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
      RolesRecord.workshopWorker,
      RolesRecord.client,
    ],
    url: "/intranet/proyectos/",
    icon: "BriefcaseBusiness",
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
    url: "/intranet/presupuestos/",
    icon: "FileText",
  },
];
