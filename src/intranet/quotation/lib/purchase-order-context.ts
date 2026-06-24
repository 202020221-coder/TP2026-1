export type PurchaseOrderContext = "incident" | "commercial";

export type PurchaseOrderAvailability =
  | "available"
  | "missing"
  | "unavailable_or_corrupt";

export type PurchaseOrderCheckResult = {
  exists: boolean;
  availability: PurchaseOrderAvailability;
  url: string | null;
  message: string;
  orden_compra_rechazada?: "YES" | "NO";
  mensaje_rechazo_orden_compra?: string | null;
};
