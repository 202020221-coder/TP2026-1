import type { Client } from "./create/client";
import type {
  InventoryItem,
  InventoryItemManufacturer,
  Pagination,
} from "./create/order-inventory";
import type { Truck } from "./create/order-trucks";
import type { Quotation } from "./quotation";

/**==============================COTIZACIONES ========================== */
export type GetQuotationsResponse =Quotation[];
export type GetQuotationResponse = Quotation;

/**==========================ADD INVENTORY ITEM TO ORDER+==================== */
export type GetInventoryItemsResponse = Pagination<InventoryItem[]>;
export interface GetClientResponse extends Client {}

/**=================================PRODUCTOS==================================== */
export type GetInventoryItemManufacturerResponse = InventoryItemManufacturer;

/**=================================CAMIONES==================================== */
export type GetAvailableTrucksResponse = Pagination<Truck[]>;