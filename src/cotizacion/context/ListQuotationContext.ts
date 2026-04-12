// import { createContext } from "react";
// import type { DetailedRequestDTO } from "@src/solicitudes/dto/ResponseGetDetailedRequest";
// import type { UseQueryResult } from "@tanstack/react-query";
// import type { DetailedQuotation } from "../dto/QuotationsDTO";
// export interface IViewQuotationContext {
//   quotationQuery: UseQueryResult<DetailedQuotation, Error>;
//   requestQuery: UseQueryResult<DetailedRequestDTO, Error>;
// }
// export const ViewQuotationContext = createContext<IViewQuotationContext | null>(
//   null
// );
import { createContext } from "react";

import type { UseQueryResult } from "@tanstack/react-query";
import type { GetQuotationQP } from "../interfaces/query.params.dto";
import type { GetQuotationsResponse } from "../interfaces/responses.dto";

interface IListQuotationContext {
    result: UseQueryResult<GetQuotationsResponse, Error>;
    query: (queryParams : GetQuotationQP) => void;
    queryParams: GetQuotationQP;
}

export const ListQuotationContext = createContext<IListQuotationContext | null>(
    null,
);
