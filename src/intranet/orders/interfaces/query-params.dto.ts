import type { OrderState } from "../enum/order-state.record";

export interface GetOrdersQP {
  nombre?: string;
  page?: number;
  limit?:number;
  // earliest_sent_date?: string;
  // latest_sent_date?: string;
  estado?: OrderState;
}