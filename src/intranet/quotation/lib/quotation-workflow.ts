import { QuotationStatesRecord } from "../enum/quotation-state.record";
import type { Quotation } from "../interfaces/quotation";
import { isQuotationAwaitingClientAction } from "./client-quotation-state";

/**
 * `pendiente` = aprobada internamente (aprobado=YES) pero aún sin proyecto creado
 * vía "Aceptar orden de servicio" (PUT /aprobar).
 */
export const isAwaitingProjectCreation = (
  quotation: Pick<Quotation, "estado">,
): boolean => quotation.estado === QuotationStatesRecord.pending;

export const isInternallyApproved = (
  quotation: Pick<Quotation, "aprobado" | "estado">,
): boolean =>
  quotation.aprobado === "YES" ||
  quotation.estado === QuotationStatesRecord.pending ||
  quotation.estado === QuotationStatesRecord.approved ||
  quotation.estado === QuotationStatesRecord.incidentPaid;

export const hasPurchaseOrderUploaded = (
  quotation: Pick<Quotation, "tieneOrdenCompra" | "ordenCompra">,
): boolean =>
  quotation.tieneOrdenCompra === true || Boolean(quotation.ordenCompra?.trim());

export const isPurchaseOrderRejected = (
  quotation: Pick<
    Quotation,
    "orden_compra_rechazada" | "motivo_rechazo_orden_compra"
  >,
): boolean => quotation.orden_compra_rechazada === "YES";

export const getPurchaseOrderRejectionMessage = (
  quotation: Pick<
    Quotation,
    | "mensaje_rechazo_orden_compra"
    | "motivo_rechazo_orden_compra"
    | "orden_compra_rechazada"
  >,
): string | null => {
  if (!isPurchaseOrderRejected(quotation)) {
    return null;
  }
  return (
    quotation.mensaje_rechazo_orden_compra?.trim() ||
    quotation.motivo_rechazo_orden_compra?.trim() ||
    "Su orden de compra fue rechazada. Puede enviar una nueva."
  );
};

export const canClientUploadPurchaseOrder = (
  quotation: Quotation,
): boolean => {
  if (
    quotation.estado === QuotationStatesRecord.approved ||
    quotation.estado === QuotationStatesRecord.rejected ||
    quotation.estado === QuotationStatesRecord.incidentPaid
  ) {
    return false;
  }

  if (isPurchaseOrderRejected(quotation)) {
    return true;
  }

  if (hasPurchaseOrderUploaded(quotation)) {
    return false;
  }

  if (quotation.esCotizacionIncidencia) {
    return (
      quotation.aprobado === "YES" &&
      quotation.estado === QuotationStatesRecord.pending
    );
  }

  return isQuotationAwaitingClientAction(quotation);
};

export const canCreateProjectFromQuotation = (
  quotation: Quotation,
): boolean =>
  quotation.aprobado === "YES" &&
  isAwaitingProjectCreation(quotation) &&
  hasPurchaseOrderUploaded(quotation) &&
  !isPurchaseOrderRejected(quotation);

export const canPayIncidentQuotation = (
  quotation: Quotation,
): boolean =>
  quotation.esCotizacionIncidencia === true &&
  quotation.aprobado === "YES" &&
  quotation.estado !== QuotationStatesRecord.incidentPaid &&
  quotation.estado !== QuotationStatesRecord.approved;
