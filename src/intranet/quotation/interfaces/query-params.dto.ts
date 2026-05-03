import type { QuotationState } from "../enum/quotation-state.record";

export interface GetInventoryItemsQP {
  page?: number;
  limit?: number;
}

export interface GetAvailableDriversQP {
  fecha?: string;
}

export interface GetAvailableTrucksQP {
  page?: number;
  limit?: number;
}


export interface GetQuotationQP {
  page?: number;
  per_page?: number;
  dni_o_ruc?: string;
  status?: QuotationState;
}
