import type { Servicio } from "./service";

export interface GetServiciosResponse {
  data: Servicio[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}
