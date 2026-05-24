import type { Pagination } from "@/shared/interfaces/api-response";
import type { Client } from "./create/client";
import type { InventoryItem } from "./create/order-inventory";
import type { Truck } from "./create/order-trucks";
import type {
  Quotation,
  QuotationConditions,
  QuotationExchangeRate,
  QuotationPickUpCosts,
  QuotationProduct,
} from "./quotation";
import type { Order } from "@/intranet/orders/interfaces/order";
export type GetQuotationsResponse = Pagination<Quotation[]>;

/**========================== INVENTORY CATALOG ======================== */
export type GetInventoryItemsResponse = Pagination<InventoryItem[]>;
export interface GetClientResponse extends Client {}

/**=================================CAMIONES==================================== */
export type GetAvailableTrucksResponse = Pagination<Truck[]>;

/**==================================CREATE QUOTATION============================ */
export type CreateQuotationBody = {
  id_solicitud: Order["ID"];
  DNI_O_RUC: string;
  nombre: string;
  productos: Omit<QuotationProduct, "nombre">[];
  id_camion: Truck["Placa"];
  costoRecojo: QuotationPickUpCosts;
  tasaCambio: QuotationExchangeRate;
  condiciones: QuotationConditions;
};
