import type { ResponseRequestDTO } from "./response-request.dto";
import type { Pagination } from "@/shared/interfaces/api-response";

export type GetRequestsResponse = Pagination<ResponseRequestDTO[]>;

export type GetRequestResponse = ResponseRequestDTO;
