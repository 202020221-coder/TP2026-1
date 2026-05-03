import type {
  GetOrderResponse,
  GetOrdersResponse,
} from "../interfaces/responses.dto";
import type { Order } from "../interfaces/order";
import axiosInstance from "@/shared/api/axios.config";
import type { GetOrdersQP } from "../interfaces/query-params.dto";
import { toSearchParams } from "@/shared/lib/to-search-params";
import type { QuotationProduct } from "@/intranet/quotation/interfaces/quotation";
import sleep from "@/shared/lib/sleep";

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

/**==============================PRODUCTOS=============================== */
export const getOrderProducts = async (
  _id: Order["ID"],
): Promise<QuotationProduct[]> => {
  await sleep(4000);
  return productosMock.slice(0, 2);
};

const productosMock: QuotationProduct[] = [
  {
    id: "1",
    nombre: "Laptop X",
    intencion: "alquilar",
    cantidad: 2,
    precio_unitario: 1500,
  },
  {
    id: "2",
    nombre: "Mouse inalámbrico",
    intencion: "alquilar",
    cantidad: 5,
    precio_unitario: 25,
  },
  {
    id: "3",
    nombre: "Teclado mecánico",
    intencion: "comprar",
    cantidad: 3,
    precio_unitario: 80,
  },
  {
    id: "4",
    nombre: "Monitor 24''",
    intencion: "alquilar",
    cantidad: 4,
    precio_unitario: 200,
  },
  {
    id: "5",
    nombre: "Auriculares",
    intencion: "alquilar",
    cantidad: 6,
    precio_unitario: 60,
  },
];
