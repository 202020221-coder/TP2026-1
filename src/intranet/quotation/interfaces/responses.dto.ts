import type { Pagination } from "@/shared/interfaces/api-response";
import type { Client } from "./create/client";
import type {
  InventoryItem,
} from "./create/order-inventory";
import type { Truck } from "./create/order-trucks";
import type { DetailedQuotation, Quotation } from "./quotation";
export type GetQuotationsResponse = Pagination<Quotation[]>;
export type GetQuotationResponse = DetailedQuotation;

/**========================== INVENTORY CATALOG ======================== */
export type GetInventoryItemsResponse = Pagination<InventoryItem[]>;
export interface GetClientResponse extends Client {}

/**=================================CAMIONES==================================== */
export type GetAvailableTrucksResponse = Pagination<Truck[]>;
