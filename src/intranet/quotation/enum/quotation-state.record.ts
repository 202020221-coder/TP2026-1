export const QuotationStatesRecord = {
  rejected: "rechazado",
  approved: "aprobado",
  pending: "pendiente",
  notApproved: "no_aprobado",
  incidentPaid: "incidencia_pagada",
} as const;

export type QuotationState =
  (typeof QuotationStatesRecord)[keyof typeof QuotationStatesRecord];

export const quotationStateLabels: Record<QuotationState, string> = {
  [QuotationStatesRecord.rejected]: "Rechazado",
  [QuotationStatesRecord.approved]: "Aprobado",
  [QuotationStatesRecord.pending]: "Pendiente (sin proyecto)",
  [QuotationStatesRecord.notApproved]: "No aprobado",
  [QuotationStatesRecord.incidentPaid]: "Incidencia pagada",
};
