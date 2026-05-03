export const QuotationStatesRecord = {
  rejected: "rechazado",
  approved: "aprobado",
  pending: "pendiente",
} as const;

export type QuotationState = (typeof QuotationStatesRecord)[keyof typeof QuotationStatesRecord];
