import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";
import type { Quotation } from "../interfaces/quotation";
import { QuotationStatesRecord } from "../enum/quotation-state.record";
import {
  hasPurchaseOrderUploaded,
  isAwaitingProjectCreation,
  isPurchaseOrderRejected,
} from "./quotation-workflow";

const APPROVER_ROLES: UserRole[] = [
  RolesRecord.manager,
  RolesRecord.projectAdmin,
];

export const canApprovePurchaseOrder = (
  role: UserRole | null | undefined,
): boolean => Boolean(role && APPROVER_ROLES.includes(role));

/** OC subida + cotización en pendiente (aprobada internamente, sin proyecto). */
export const hasPendingPurchaseOrderApproval = (
  quotation: Quotation,
): boolean => {
  if (isPurchaseOrderRejected(quotation)) {
    return false;
  }

  if (quotation.pendienteAprobacionOrden === true) {
    return true;
  }

  return (
    quotation.aprobado === "YES" &&
    isAwaitingProjectCreation(quotation) &&
    hasPurchaseOrderUploaded(quotation)
  );
};
