import type { Order } from "@/intranet/orders/interfaces/order";
import type {
  GetAvailableTrucksResponse,
  GetInventoryItemManufacturerResponse,
} from "../interfaces/responses.dto";
import axiosInstance from "@/shared/api/axios.config";
import type { InventoryItemManufacturer } from "../interfaces/create/order-inventory";

import { toSearchParams } from "@/shared/lib/to-search-params";
import type { GetAvailableTrucksQP } from "../interfaces/query-params.dto";
import type { QuotationProductIntention } from "../enum/order-inventory-intention";
import sleep from "@/shared/lib/sleep";

/**==============================PRODUCTOS=============================== */

export const getInventoryItemManufacturer = async (
  manufacturerId: InventoryItemManufacturer["ID_Fabricante"],
) => {
  const response =
    await axiosInstance.get<GetInventoryItemManufacturerResponse>(
      `/fabricantes/${manufacturerId}`,
    );
  return response.data;
};

export const getOrderProducts = async (_id: Order["ID"]): Promise<Product[]> => {
  await sleep(4000);
  return productosMock.slice(0,2);
};

export const getQuotationProducts = async (
  _id: string,
): Promise<Product[]> => {
  await sleep(4000);
  return productosMock;
};

/**==========================CAMIONES======================= */
export const getAvailableTrucks = async ({
  page = 1,
  limit = 10,
}: GetAvailableTrucksQP) => {
  const response = await axiosInstance.get<GetAvailableTrucksResponse>(
    `/camiones?${toSearchParams({ page, limit })}`,
  );
  return response.data;
};

interface Product {
  id: string;
  nombre: string;
  fabricante: string;
  intencion: QuotationProductIntention;
  cantidad: number;
  precio_unitario: number;
}

const productosMock: Product[] = [
  {
    id: "1",
    nombre: "Laptop X",
    fabricante: "TechCorp",
    intencion: "alquilar",
    cantidad: 2,
    precio_unitario: 1500,
  },
  {
    id: "2",
    nombre: "Mouse inalámbrico",
    fabricante: "PeriTech",
    intencion: "alquilar",
    cantidad: 5,
    precio_unitario: 25,
  },
  {
    id: "3",
    nombre: "Teclado mecánico",
    fabricante: "KeyMasters",
    intencion: "comprar",
    cantidad: 3,
    precio_unitario: 80,
  },
  {
    id: "4",
    nombre: "Monitor 24''",
    fabricante: "DisplayPro",
    intencion: "alquilar",
    cantidad: 4,
    precio_unitario: 200,
  },
  {
    id: "5",
    nombre: "Auriculares",
    fabricante: "SoundMax",
    intencion: "alquilar",
    cantidad: 6,
    precio_unitario: 60,
  },
];
