import type { QuotationState } from "../enum/quotation-state.record";

export interface GetQuotationQP {
    quotation_name?: string;
    page?: number;
    per_page?:number;
    earliest_sent_date?: string;
    latest_sent_date?: string;
    status?: QuotationState;
}