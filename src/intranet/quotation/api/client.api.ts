import type { Client } from "../interfaces/create/client";
import type { GetClientResponse } from "../interfaces/responses.dto";
import axiosInstance from "@/shared/api/axios.config";
export const getClient = async (id: Client["DNI_O_RUC"]) => {
  const response = await axiosInstance.get<GetClientResponse>(
    `/clientes/${id}`,
  );
  return response.data;
};
