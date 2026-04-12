// import type { Client } from "../interfaces/client";
import type { GetClientResponse } from "../interfaces/responses.dto";
import axiosInstance from "@/shared/api/axios.config";
import type { Service } from "../interfaces/service";
export const getService = async (id:Service["ID_Servicio"]) => {
    const response = await axiosInstance.get<GetClientResponse>(`/clientes/${id}`)
    return response.data
}
