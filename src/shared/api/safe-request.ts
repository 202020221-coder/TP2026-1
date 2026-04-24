import { type AxiosRequestConfig } from "axios";
import axiosInstance from "./axios.config";
import type { APIResponse } from "../interfaces/api-response";

export async function safeRequest<T>(
  config: AxiosRequestConfig,
): Promise<APIResponse<T>> {
  const response = await axiosInstance.request<APIResponse<T>>(config);
  console.log(response);
  
  const data = response.data;
  return data;
}
