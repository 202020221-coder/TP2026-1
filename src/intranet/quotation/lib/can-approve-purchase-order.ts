import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";
import type { Quotation } from "../interfaces/quotation";

const APPROVER_ROLES: UserRole[] = [
  RolesRecord.manager,
  RolesRecord.projectAdmin,
];

export const canApprovePurchaseOrder = (
  role: UserRole | null | undefined,
): boolean => Boolean(role && APPROVER_ROLES.includes(role));

export const hasPendingPurchaseOrderApproval = (
  quotation: Quotation,
): boolean => quotation.pendienteAprobacionOrden === true;
