import type { Pagination } from "@/shared/interfaces/api-response";
import type { Order } from "./order";

export type GetOrderResponse = Order;
export type GetOrdersResponse = Pagination<Order[]>;
