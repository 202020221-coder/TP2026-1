export const QuotationProductIntentionsRecord = {
  buy: "comprar",
  rent: "alquilar",
} as const;

export type QuotationProductIntention =
  (typeof QuotationProductIntentionsRecord)[keyof typeof QuotationProductIntentionsRecord];
