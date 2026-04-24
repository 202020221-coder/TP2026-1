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
  quotation_name?: string;
  page?: number;
  per_page?: number;
  earliest_sent_date?: string;
  latest_sent_date?: string;
  status?: QuotationState;
}
