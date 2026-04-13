import type { Order } from "@/solicitudes/interfaces/order";
import type {
  GetDetailedOrderInventoryItemResponse,
  GetInventoryItemManufacturerResponse,
  GetOrderInventoryResponse,
} from "../interfaces/responses.dto";
import axiosInstance from "@/shared/api/axios.config";
import type {
  InventoryItemManufacturer,
  OrderInventoryElementItem,
} from "../interfaces/create/order-inventory";

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
