import type { OrderInventoryItemIntention } from "@/cotizacion/enum/order-inventory-intention";

export interface OrderInventoryElementItem {
  id: number;
  ID_Solicitud: number;
  ID_Inventario: number;
  cantidad: number;
  intencion: OrderInventoryItemIntention;
  dias_alquilados: null | number;
}