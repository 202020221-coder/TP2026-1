import type { QuotationState } from "../enum/quotation-state.record";

export interface GetInventoryItemsQP {
  page?: number;
  limit?: number;
}

export interface GetAvailableTrucksQP {
  page?: number;
  limit?: number;
}

export interface GetQuotationQP {
  page?: number;
  per_page?: number;
  limit?: number;
  dni_o_ruc?: string;
  estado?: QuotationState;
  nombre?: string;
  pendiente_aprobacion?: boolean;
}
