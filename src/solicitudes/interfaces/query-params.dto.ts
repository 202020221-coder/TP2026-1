import type { OrderState } from "../enum/order-state.record";

export interface GetOrdersQP {
  order_name?: string;
  page?: number;
  limit?:number;
  earliest_sent_date?: string;
  latest_sent_date?: string;
  status?: OrderState;
}