import { type AxiosRequestConfig } from "axios";
import axiosInstance from "./axios.config";
import type { APIResponse } from "../interfaces/api-response";

export async function safeRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.request<APIResponse<T>>(config);
  const data = response.data;
  if (data.error) {
    const error = data.error;
    throw new Error(`Error: ${error.message}`, { cause: error.details });
  }
  return data.data;
}
