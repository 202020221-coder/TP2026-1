import { safePagination, safeRequest } from "@/shared/api/safe-request";
import type {
  ResponseRequestDTO,
  UpdateRequestDTO,
  DeleteRequestDTO,
  GetProductDTO,
  GetServiceDTO
} from "../interfaces";
import { toSearchParams } from "@/shared/lib/to-search-params";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import type { GetRequestsQP, GetRequestsResponse } from "../interfaces";


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

export const GetAllRequest = async (
  params: GetRequestsQP,
): Promise<GetRequestsResponse> => {
  const sessionState = useSession.getState();

  if (sessionState.loggedUser?.rol === RolesRecord.client) {
    return safePagination<ResponseRequestDTO[]>({
      url: `/perfiles/${sessionState.loggedUser.dni_perfil}/solicitudes?${toSearchParams(
        params as Record<string, any>,
      )}`,
      method: "GET",
    });
  }

  return safePagination<ResponseRequestDTO[]>({
    url: `/solicitudes?${toSearchParams(params as Record<string, any>)}`,
    method: "GET",
  });
};

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