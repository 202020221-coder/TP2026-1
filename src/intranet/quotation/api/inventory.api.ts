import axiosInstance from "@/shared/api/axios.config";
import type { GetInventoryItemsResponse } from "../interfaces/responses.dto";
import { toSearchParams } from "@/shared/lib/to-search-params";
import type { GetInventoryItemsQP } from "../interfaces/query-params.dto";

export const getInventoryItems = async ({
  limit = 6,
  page = 1,
}: GetInventoryItemsQP) => {
  const response = await axiosInstance.get<GetInventoryItemsResponse>(
    `/inventario?${toSearchParams({ limit, page })}`,
  );
  return response.data;
};
