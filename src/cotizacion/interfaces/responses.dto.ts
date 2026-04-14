import type { Client } from "./client";
import type {
  InventoryItem,
  InventoryItemManufacturer,
  OrderInventoryElementItem,
  OrderInventoryElementItemDetail,
  OrderInventoryTableElement,
  Pagination,
} from "./create/order-inventory";
export interface GetClientResponse extends Client {}

export type GetFullOrderInventoryResponse = OrderInventoryTableElement[];
export type GetOrderInventoryResponse = OrderInventoryElementItem[];
export type GetDetailedOrderInventoryItemResponse =
  OrderInventoryElementItemDetail;
export type GetInventoryItemManufacturerResponse = InventoryItemManufacturer;


/**==========================ADD INVENTORY ITEM TO ORDER+==================== */
export type GetInventoryItemsResponse = Pagination<InventoryItem[]>