import type { Client } from "./client";
import type { InventoryItemManufacturer, OrderInventoryElementItem, OrderInventoryElementItemDetail } from "./create/order-inventory";
export interface GetClientResponse extends Client {}

export type GetOrderInventoryResponse = OrderInventoryElementItem[];
export type GetDetailedOrderInventoryItemResponse = OrderInventoryElementItemDetail;
export type GetInventoryItemManufacturerResponse = InventoryItemManufacturer;