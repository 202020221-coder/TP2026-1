export const OrderStatesRecord = {
  rejected: "rechazado",
  approved: "aceptado",
  pending: "pendiente",
} as const;

export type OrderState =
  (typeof OrderStatesRecord)[keyof typeof OrderStatesRecord];
