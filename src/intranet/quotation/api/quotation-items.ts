import axiosInstance from "@/shared/api/axios.config";

export const getTrucksByQuotation = (quotationId: number) =>
  axiosInstance.get(`/cotizaciones/${quotationId}/trucks`);

export const addTruckToQuotation = async (
  quotationId: number,
  data: unknown,
) => {
  const response = await axiosInstance.post(
    `/cotizaciones/${quotationId}/trucks`,
    data,
  );
  return response.data;
};

export const updateQuotationTruck = async (
  quotationId: number,
  truckId: number,
  data: unknown,
) => {
  const response = await axiosInstance.put(
    `/cotizaciones/${quotationId}/trucks/${truckId}`,
    data,
  );
  return response.data;
};

export const deleteQuotationTruck = (quotationId: number, truckId: number) =>
  axiosInstance.delete(`/cotizaciones/${quotationId}/trucks/${truckId}`);

export const getInventoryByQuotation = (quotationId: number) =>
  axiosInstance.get(`/cotizaciones/${quotationId}/inventory`);

export const addInventoryToQuotation = async (
  quotationId: number,
  data: unknown,
) => {
  const response = await axiosInstance.post(
    `/cotizaciones/${quotationId}/inventory`,
    data,
  );
  return response.data;
};

export const updateQuotationInventory = async (
  quotationId: number,
  inventoryId: number,
  data: unknown,
) => {
  const response = await axiosInstance.put(
    `/cotizaciones/${quotationId}/inventory/${inventoryId}`,
    data,
  );
  return response.data;
};

export const deleteQuotationInventory = (quotationId: number, inventoryId: number) =>
  axiosInstance.delete(`/cotizaciones/${quotationId}/inventory/${inventoryId}`);

export const getServicesByQuotation = (quotationId: number) =>
  axiosInstance.get(`/cotizaciones/${quotationId}/services`);

export const addServiceToQuotation = async (
  quotationId: number,
  data: unknown,
) => {
  const response = await axiosInstance.post(
    `/cotizaciones/${quotationId}/services`,
    data,
  );
  return response.data;
};

export const updateQuotationService = async (
  quotationId: number,
  serviceId: number,
  data: unknown,
) => {
  const response = await axiosInstance.put(
    `/cotizaciones/${quotationId}/services/${serviceId}`,
    data,
  );
  return response.data;
};

export const deleteQuotationService = (quotationId: number, serviceId: number) =>
  axiosInstance.delete(`/cotizaciones/${quotationId}/services/${serviceId}`);

export const getCompleteQuotation = async (quotationId: number) => {
  const response = await axiosInstance.get(`/cotizaciones/${quotationId}/complete`);
  return response.data;
};

export default {};
