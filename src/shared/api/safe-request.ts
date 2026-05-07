import { type AxiosRequestConfig } from "axios";
import axiosInstance from "./axios.config";
import type { APIResponse, Pagination } from "../interfaces/api-response";

export async function safeRequest<T>(
  config: AxiosRequestConfig,
): Promise<APIResponse<T>> {
  const response = await axiosInstance.request<APIResponse<T>>(config);
  const data = response.data;
  return data;
}


export async function safePagination<T>(
  config: AxiosRequestConfig,
): Promise<Pagination<T>> {
  const response = await axiosInstance.request<Pagination<T>>(config);
  console.log(response);
  
  const data = response.data;
  return data;
}