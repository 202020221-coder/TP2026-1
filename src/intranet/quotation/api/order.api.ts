import type { Order } from "@/intranet/orders/interfaces/order";
import type {
  GetAvailableDriversResponse,
  GetAvailableTrucksResponse,
  GetDetailedOrderInventoryItemResponse,
  GetFullOrderInventoryResponse,
  GetInventoryItemManufacturerResponse,
  GetOrderInventoryResponse,
} from "../interfaces/responses.dto";
import axiosInstance from "@/shared/api/axios.config";
import type {
  InventoryItemManufacturer,
  OrderInventoryElementItem,
} from "../interfaces/create/order-inventory";
import type { OrderInventoryTableElement } from "../interfaces/create/order-inventory";
import { toSearchParams } from "@/shared/lib/to-search-params";
import type {
  GetAvailableDriversQP,
  GetAvailableTrucksQP,
} from "../interfaces/query-params.dto";
//productos
export const getOrderInventory = async (
  id: Order["ID"],
): Promise<GetOrderInventoryResponse> => {
  const response = await axiosInstance.get<GetOrderInventoryResponse>(
    `/solicitudes/${id}/inventario`,
  );
  return response.data;
};

export const getOrderInventoryItem = async (
  id: OrderInventoryElementItem["ID_Inventario"],
) => {
  const response =
    await axiosInstance.get<GetDetailedOrderInventoryItemResponse>(
      `/inventario/${id}`,
    );
  return response.data;
};

export const getInventoryItemManufacturer = async (
  manufacturerId: InventoryItemManufacturer["ID_Fabricante"],
) => {
  const response =
    await axiosInstance.get<GetInventoryItemManufacturerResponse>(
      `/fabricantes/${manufacturerId}`,
    );
  return response.data;
};

export const getFullOrderInventory = async (
  id: Order["ID"],
): Promise<GetFullOrderInventoryResponse> => {
  const inventoryList = await axiosInstance.get<GetOrderInventoryResponse>(
    `/solicitudes/${id}/inventario`,
  );

  const tableElements: OrderInventoryTableElement[] = [];

  for (const item of inventoryList.data) {
    // detalles del item
    const itemDetailPromise = getOrderInventoryItem(item.ID_Inventario);
    const itemDetail = await itemDetailPromise;
    const manufacturer = await getInventoryItemManufacturer(
      itemDetail.ID_Fabricante,
    );

    tableElements.push({
      id: String(item.ID_Inventario),
      producto: itemDetail.nombre_objeto,
      fabricante: manufacturer.nombre_comercial,
      estado: itemDetail.estado,
      intencion: item.intencion,
      cantidad: item.cantidad,
      precio_unitario: parseFloat(itemDetail.precio_comercial),
    });
  }

  return tableElements;
};

//caminiones
export const getAvailableTrucks = async ({
  page = 1,
  limit = 10,
}: GetAvailableTrucksQP) => {
  const response = await axiosInstance.get<GetAvailableTrucksResponse>(
    `/camiones?${toSearchParams({ page, limit })}`,
  );
  return response.data;
};

export const getAvailableDrivers = async ({
  fecha = new Date().toISOString().split("T")[0],
}: GetAvailableDriversQP) => {
  const response = await axiosInstance.get<GetAvailableDriversResponse>(
    `/perfiles/conductores/disponibles?${toSearchParams({ fecha })}`,
  );
  const availableDrivers = response.data.filter(
    (profile) => profile.estado === "disponible",
  );

  return availableDrivers;
};
