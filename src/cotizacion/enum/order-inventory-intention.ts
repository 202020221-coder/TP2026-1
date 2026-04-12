export const OrderInventoryIntentionsRecord = {
  buy: "comprar",
  rent: "alquilar",
} as const;

export type OrderInventoryItemIntention =
  (typeof OrderInventoryIntentionsRecord)[keyof typeof OrderInventoryIntentionsRecord];
