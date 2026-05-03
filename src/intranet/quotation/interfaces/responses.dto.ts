import type { Pagination } from "@/shared/interfaces/api-response";
import type { Client } from "./create/client";
import type {
  InventoryItem,
  InventoryItemManufacturer,
  OrderInventoryElementItem,
  OrderInventoryElementItemDetail,
  OrderInventoryTableElement,
} from "./create/order-inventory";
import type { Pilot, Truck } from "./create/order-trucks";
import type { Quotation } from "./quotation";
import type {
  QuotationTruck,
  QuotationInventory,
  QuotationService,
  QuotationComplete,
} from "./create/quotation-items";
export type GetQuotationsResponse = Pagination<Quotation[]>;
export type GetQuotationResponse = Quotation;

export type GetQuotationTrucksResponse = Pagination<QuotationTruck[]>;
export type GetQuotationInventoryResponse = Pagination<QuotationInventory[]>;
export type GetQuotationServicesResponse = Pagination<QuotationService[]>;
export type GetCompleteQuotationResponse = QuotationComplete;

export type GetInventoryItemsResponse = Pagination<InventoryItem[]>;
export interface GetClientResponse extends Client {}


export type GetOrderInventoryResponse = OrderInventoryElementItem[];
export type GetDetailedOrderInventoryItemResponse =
  OrderInventoryElementItemDetail;
export type GetInventoryItemManufacturerResponse = InventoryItemManufacturer;
export type GetFullOrderInventoryResponse = OrderInventoryTableElement[];


export type GetAvailableTrucksResponse = Pagination<Truck[]>;
export type GetAvailableDriversResponse = Pilot[];
