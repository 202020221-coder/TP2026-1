import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";
import type { Quotation } from "../interfaces/quotation";

const INTERNAL_APPROVER_ROLES: UserRole[] = [
  RolesRecord.manager,
  RolesRecord.projectAdmin,
  RolesRecord.lawyer,
];

export const canViewUnapprovedQuotationsToggle = (
  role: UserRole | null | undefined,
): boolean =>
  Boolean(role && INTERNAL_APPROVER_ROLES.includes(role));

export const canApproveInternally = (
  role: UserRole | null | undefined,
  quotation: Pick<
    Quotation,
    | "aprobado"
    | "esCotizacionIncidencia"
    | "aprobado_por_abogado"
    | "aprobado_por_gerente"
  >,
  viewingUnapproved: boolean,
): boolean => {
  if (!viewingUnapproved) {
    return false;
  }

  if (quotation.aprobado === "YES") {
    return false;
  }

  if (!role || !INTERNAL_APPROVER_ROLES.includes(role)) {
    return false;
  }

  if (quotation.esCotizacionIncidencia) {
    if (role === RolesRecord.lawyer) {
      return quotation.aprobado_por_abogado !== "YES";
    }
    if (
      role === RolesRecord.manager ||
      role === RolesRecord.projectAdmin
    ) {
      return quotation.aprobado_por_gerente !== "YES";
    }
    return false;
  }

  if (role === RolesRecord.lawyer) {
    return false;
  }

  return true;
};
