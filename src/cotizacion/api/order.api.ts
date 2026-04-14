import type { Order } from "@/solicitudes/interfaces/order";
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

/**==============================PRODUCTOS=============================== */
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
    // Obtener detalles del item (paralelo entre items)
    const itemDetailPromise = getOrderInventoryItem(item.ID_Inventario);

    // Manufacturer es secuencial por cada item
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
}

/**==========================CAMIONES======================= */
export const getAvailableTrucks = async () => {
  const response =
    await axiosInstance.get<GetAvailableTrucksResponse>(`/camiones`);

  const data = response.data.filter(
    () => true /**DEBE HABER UN CAMPO QUE FILTRE CAMIONES DISPONIBLES */,
  );
  return data;
};

export const getAvailableDrivers = async () => {
  const response =
    await axiosInstance.get<GetAvailableDriversResponse>(`/perfiles`);
  const availableProfiles = response.data.filter(
    (profile) => profile.estado === "disponible",
  );

  const brevetesResponses = await Promise.all(
    availableProfiles.map((profile) =>
      axiosInstance.get<unknown[]>(`/perfiles/${profile.DNI}/brevetes`),
    ),
  );
  //los que tienen brevetes son conductores
  const availableDrivers = availableProfiles.filter(
    (_, index) => brevetesResponses[index].data.length > 0,
  );

  return availableDrivers;
};
