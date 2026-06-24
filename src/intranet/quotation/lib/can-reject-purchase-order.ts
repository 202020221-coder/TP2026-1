import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";
import type { Quotation } from "../interfaces/quotation";
import { canApprovePurchaseOrder } from "./can-approve-purchase-order";
import {
  hasPurchaseOrderUploaded,
  isPurchaseOrderRejected,
} from "./quotation-workflow";

export const canRejectPurchaseOrder = (
  role: UserRole | null | undefined,
  quotation: Quotation,
): boolean => {
  if (isPurchaseOrderRejected(quotation)) {
    return false;
  }

  if (!role) {
    return false;
  }

  const hasOcPendingReview =
    quotation.pendienteAprobacionOrden === true ||
    hasPurchaseOrderUploaded(quotation);

  if (role === RolesRecord.lawyer) {
    return (
      quotation.esCotizacionIncidencia === true && hasOcPendingReview
    );
  }

  if (!canApprovePurchaseOrder(role)) {
    return false;
  }

  if (quotation.esCotizacionIncidencia) {
    return hasOcPendingReview;
  }

  return hasOcPendingReview;
};
