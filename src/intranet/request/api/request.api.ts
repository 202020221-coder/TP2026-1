import { safePagination, safeRequest } from "@/shared/api/safe-request";
import type {
  ResponseRequestDTO,
  UpdateRequestDTO,
  DeleteRequestDTO,
  GetProductDTO,
  GetServiceDTO
} from "../interfaces";


export const UpdateRequest = async (id: number, data: UpdateRequestDTO) =>
  safeRequest<UpdateRequestDTO>({
    url: `/solicitudes/${id}`,
    data: data,
    method: "PUT",
  });

export const DeleteRequest = async (id: number) =>
  safeRequest<DeleteRequestDTO>({
    url: `/solicitudes/${id}`,
    method: "DELETE",
  });

export const GetAllRequest = async () =>
  safePagination<ResponseRequestDTO>({
    url: "/solicitudes",
    method: "GET",
  });

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