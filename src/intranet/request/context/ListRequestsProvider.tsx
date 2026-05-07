import { useState, type FC, type ReactNode } from "react";
import type { GetRequestsQP } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { GetAllRequest } from "../api/request.api";
import { ListRequestContext } from "./ListRequestContext";

export const ListRequestsProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [queryParams, setQueryParams] = useState<GetRequestsQP>({
        page: 1,
        per_page: 10,
    });
    const result = useQuery({
        queryKey: ["requests", queryParams],
        queryFn: () => GetAllRequest(queryParams),
    });

    const query = (queryParams: GetRequestsQP) => {
        setQueryParams(queryParams);
      };
    
    console.log(result.data);

    return (
        <ListRequestContext.Provider value={{ result, query, queryParams }}>
            {children}
        </ListRequestContext.Provider>
    );
};

export default ListRequestsProvider;
