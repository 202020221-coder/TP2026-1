import { RolesRecord } from "@/security/session/enum/roles.enum";
import { QuotationStatesRecord } from "../enum/quotation-state.record";
import type { Quotation } from "../interfaces/quotation";
import type { UserRole } from "@/security/session/interfaces/roles";

/** Cliente y asistente negocian mientras la cotización no esté rechazada. */
export function canNegotiateQuotation(
  quotation: Pick<Quotation, "estado">,
  userRole: UserRole | undefined,
): boolean {
  if (!userRole || quotation.estado === QuotationStatesRecord.rejected) {
    return false;
  }

  if (userRole === RolesRecord.projectAdmin) {
    return (
      quotation.estado === QuotationStatesRecord.pending ||
      quotation.estado === QuotationStatesRecord.approved
    );
  }

  if (userRole === RolesRecord.client) {
    return quotation.estado === QuotationStatesRecord.pending;
  }

  return false;
}
