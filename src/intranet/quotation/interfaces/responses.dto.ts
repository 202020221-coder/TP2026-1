import type { Client } from "./create/client";
import type {
  InventoryItem,
  Pagination,
} from "./create/order-inventory";
import type { Truck } from "./create/order-trucks";
import type { Quotation } from "./quotation";

/**==============================COTIZACIONES ========================== */
export type GetQuotationsResponse =Quotation[];
export type GetQuotationResponse = Quotation;

/**========================== INVENTORY CATALOG ======================== */
export type GetInventoryItemsResponse = Pagination<InventoryItem[]>;
export interface GetClientResponse extends Client {}

/**=================================CAMIONES==================================== */
export type GetAvailableTrucksResponse = Pagination<Truck[]>;