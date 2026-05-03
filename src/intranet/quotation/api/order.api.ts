import type { GetAvailableTrucksResponse } from "../interfaces/responses.dto";
import axiosInstance from "@/shared/api/axios.config";

import { toSearchParams } from "@/shared/lib/to-search-params";
import type { GetAvailableTrucksQP } from "../interfaces/query-params.dto";

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