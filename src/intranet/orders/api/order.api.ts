import type {
  GetOrderResponseDTO,
  GetOrdersResponse,
} from "../interfaces/responses.dto";
import type { Order } from "../interfaces/order";
import axiosInstance from "@/shared/api/axios.config";
import type { GetOrdersQP } from "../interfaces/query-params.dto";
import { toSearchParams } from "@/shared/lib/to-search-params";
import type {
  GetProductDTO,
  GetServiceDTO,
  UpdateRequestDTO,
} from "../interfaces";
import { safePagination } from "@/shared/api/safe-request";
import { OrderStatesRecord } from "../enum/order-state.record";
import { normalizeOrderInventory } from "../lib/normalize-order-inventory";

export const getAllOrders = async ({
  page,
  limit,
  nombre,
  estado,
}: GetOrdersQP): Promise<GetOrdersResponse> => {
  const response = axiosInstance.get<GetOrdersResponse>(
    `/solicitudes?${toSearchParams({ page, limit, nombre, estado })}`,
  );
  return (await response).data;
};

type OrderLike = Order & { Estado?: string };

/** Lee el estado tolerando `estado` o `Estado` del backend. */
export function normalizeOrderEstado(order: OrderLike): string {
  return String(order.estado ?? order.Estado ?? "")
    .trim()
    .toLowerCase();
}

export function isPendingOrder(order: Order): boolean {
  const estado = normalizeOrderEstado(order);
  if (!estado) return true;
  return estado === OrderStatesRecord.pending;
}

export function normalizeOrdersResponse(payload: unknown): GetOrdersResponse {
  if (Array.isArray(payload)) {
    const data = payload as Order[];
    return {
      data,
      pagination: {
        total: data.length,
        page: 1,
        limit: data.length || 1,
        totalPages: 1,
      },
    };
  }

  const obj = (payload ?? {}) as Partial<GetOrdersResponse>;
  const data = Array.isArray(obj.data) ? obj.data : [];
  const pagination = obj.pagination ?? {
    total: data.length,
    page: 1,
    limit: data.length || 1,
    totalPages: 1,
  };

  return {
    data,
    pagination: {
      total: pagination.total ?? data.length,
      page: pagination.page ?? 1,
      limit: pagination.limit ?? (data.length || 1),
      totalPages: pagination.totalPages ?? 1,
    },
  };
}

/**
 * Carga solicitudes pendientes para dashboards.
 * Usa el mismo filtro que el listado (`estado=pendiente`) y confía en el total del servidor.
 */
export async function getPendingOrdersSummary(): Promise<{
  orders: Order[];
  total: number;
}> {
  try {
    const page = normalizeOrdersResponse(
      await getAllOrders({
        page: 1,
        limit: 500,
        estado: OrderStatesRecord.pending,
      }),
    );
    const orders = page.data;
    const total = Math.max(page.pagination.total ?? 0, orders.length);
    return { orders, total };
  } catch {
    return { orders: [], total: 0 };
  }
}

export const getOrder = async (id: Order["ID"]): Promise<GetOrderResponseDTO> => {
  const response = await axiosInstance.get<GetOrderResponseDTO>(
    `/solicitudes/${id}`,
  );
  return {
    ...response.data,
    inventario: normalizeOrderInventory(response.data.inventario),
  };
};

export const UpdateRequest = async (id: number, data: UpdateRequestDTO) => {
  const response = await axiosInstance.put(`/solicitudes/${id}`, data);
  return response.data;
};

export const RejectRequest = async (id: Order["ID"]) => {
  await axiosInstance.put(`/solicitudes/${id}`, {
    estado: OrderStatesRecord.rejected,
  });
};

export const GetAllProducts = async (page: number, limit: number) =>
  safePagination<GetProductDTO[]>({
    url: `/inventario`,
    method: "GET",
    params: { page, limit },
  });

export const GetAllServices = async (page: number, limit: number) =>
  safePagination<GetServiceDTO[]>({
    url: `/servicios`,
    method: "GET",
    params: { page, limit },
  });
