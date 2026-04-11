export const OrderStatesRecord = {
  rejected: "Rechazada",
  approved: "Aprobada",
  pending: "Pendiente",
} as const;

export type OrderState = (typeof OrderStatesRecord)[keyof typeof OrderStatesRecord];
