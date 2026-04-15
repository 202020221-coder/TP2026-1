import type { Client } from "./client";
import type {
  InventoryItem,
  InventoryItemManufacturer,
  OrderInventoryElementItem,
  OrderInventoryElementItemDetail,
  OrderInventoryTableElement,
  Pagination,
} from "./create/order-inventory";
import type { Pilot, Truck } from "./create/order-trucks";

/**==========================ADD INVENTORY ITEM TO ORDER+==================== */
export type GetInventoryItemsResponse = Pagination<InventoryItem[]>;
export interface GetClientResponse extends Client {}

/**=================================PRODUCTOS==================================== */
export type GetOrderInventoryResponse = OrderInventoryElementItem[];
export type GetDetailedOrderInventoryItemResponse =
  OrderInventoryElementItemDetail;
export type GetInventoryItemManufacturerResponse = InventoryItemManufacturer;
export type GetFullOrderInventoryResponse = OrderInventoryTableElement[];

/**=================================CAMIONES==================================== */
export type GetAvailableTrucksResponse = Pagination<Truck[]>;
export type GetAvailableDriversResponse = Pilot[];
