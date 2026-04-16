export const QuotationStatesRecord = {
  rejected: "Rechazada",
  approved: "Aprobada",
  pending: "Pendiente",
} as const;

export type QuotationState = (typeof QuotationStatesRecord)[keyof typeof QuotationStatesRecord];
