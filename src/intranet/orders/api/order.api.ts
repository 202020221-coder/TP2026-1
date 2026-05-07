import type {
  GetOrderResponse,
  GetOrdersResponse,
} from "../interfaces/responses.dto";
import type { Order } from "../interfaces/order";
import axiosInstance from "@/shared/api/axios.config";
import type { GetOrdersQP } from "../interfaces/query-params.dto";
import { toSearchParams } from "@/shared/lib/to-search-params";

export const getAllOrders = async ({
  page,
  limit,
}: GetOrdersQP): Promise<GetOrdersResponse> => {
  const response = axiosInstance.get<GetOrdersResponse>(
    `/solicitudes?${toSearchParams({ page, limit })}`,
  );
  return (await response).data;
};

export const getOrder = async (id: Order["ID"]): Promise<GetOrderResponse> => {
  const response = await axiosInstance.get<GetOrderResponse>(
    `/solicitudes/${id}`,
  );
  return response.data;
};

import type { GetProductDTO, GetServiceDTO,UpdateRequestDTO } from "../interfaces";
import { safePagination } from "@/shared/api/safe-request";

export const UpdateRequest = async (id: number, data: UpdateRequestDTO) => {
  const response = await axiosInstance.put(`/solicitudes/${id}`, data)
  return response.data;
}
// export const DeleteRequest = async (id: number) =>
//   safeRequest<DeleteRequestDTO>({
//     url: `/solicitudes/${id}`,
//     method: "DELETE",
//   });

// export const GetAllRequest = async () =>
//   safePagination<ResponseRequestDTO[]>({
//     url: "/solicitudes",
//     method: "GET",
//   });

//------------------------------------------------
export const GetAllProducts = async (page:number, limit:number) =>
  safePagination<GetProductDTO[]>({
    url: `/inventario`,
    method: "GET",
    params: { page, limit },
  });

export const GetAllServices = async (page:number, limit:number) =>
  safePagination<GetServiceDTO[]>({
    url: `/servicios`,
    method: "GET",
    params: { page, limit },
  });