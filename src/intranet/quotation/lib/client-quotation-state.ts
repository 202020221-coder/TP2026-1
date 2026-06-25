import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";
import {
  QuotationStatesRecord,
  quotationStateLabels,
  type QuotationState,
} from "../enum/quotation-state.record";
import type { Quotation } from "../interfaces/quotation";

/**
 * En la bandeja del cliente, una cotización comercial visible con `no_aprobado`
 * ya fue enviada y debe mostrarse como pendiente de orden de compra.
 */
export function isQuotationAwaitingClientAction(
  quotation: Pick<Quotation, "estado" | "esCotizacionIncidencia">,
): boolean {
  if (quotation.esCotizacionIncidencia) {
    return quotation.estado === QuotationStatesRecord.pending;
  }

  return (
    quotation.estado === QuotationStatesRecord.pending ||
    quotation.estado === QuotationStatesRecord.notApproved
  );
}

export function resolveQuotationDisplayState(
  quotation: Pick<Quotation, "estado" | "esCotizacionIncidencia">,
  role?: UserRole | null,
): QuotationState {
  if (
    role === RolesRecord.client &&
    !quotation.esCotizacionIncidencia &&
    quotation.estado === QuotationStatesRecord.notApproved
  ) {
    return QuotationStatesRecord.pending;
  }

  return quotation.estado;
}

export function getClientFacingStateLabel(
  quotation: Pick<Quotation, "estado" | "esCotizacionIncidencia">,
  role?: UserRole | null,
): string {
  const displayState = resolveQuotationDisplayState(quotation, role);
  return quotationStateLabels[displayState] ?? quotation.estado;
}
