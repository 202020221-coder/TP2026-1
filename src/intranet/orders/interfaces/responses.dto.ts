import type { Pagination } from "@/shared/interfaces/api-response";
import type { DetailedOrder, Order } from "./order";

export interface GetOrderErrorResponse {
  error: string;
}

export type GetOrdersResponse = Pagination<Order[]>;
export type GetOrderResponse = DetailedOrder;
