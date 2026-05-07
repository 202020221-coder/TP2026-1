import type { Pagination } from "@/shared/interfaces/api-response";
import type { DetailedOrder, Order } from "./order";

export type GetOrderResponse = DetailedOrder;
export type GetOrdersResponse = Pagination<Order[]>;
