import type {
  GetOrderResponse,
  GetOrdersResponse,
} from "../interfaces/responses.dto";
import type { Order } from "../interfaces/order";
import axiosInstance from "@/shared/api/axios.config";
import type { GetOrdersQP } from "../interfaces/query-params.dto";
import { toSearchParams } from "@/shared/lib/to-search-params";

export const getAllOrders =
  async ({page, limit}: GetOrdersQP): Promise<GetOrdersResponse> => {
    const response = axiosInstance.get<GetOrdersResponse>(`/solicitudes?${toSearchParams({page, limit})}`);
    return (await response).data;
  };
  
export const getOrder = async (id: Order["ID"]): Promise<GetOrderResponse> => {
  const response = await axiosInstance.get<GetOrderResponse>(
    `/solicitudes/${id}`,
  );
  return response.data;
};
