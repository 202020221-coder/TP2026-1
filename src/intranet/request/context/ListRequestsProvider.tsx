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
    });
    const result = useQuery({
        queryKey: ["requests", queryParams],
        queryFn: () => GetAllRequest(),
    });
    const query = (qp: GetRequestsQP) => {
        setQueryParams(qp);
    };

    return (
        <ListRequestContext.Provider value={{ result, query, queryParams }}>
            {children}
        </ListRequestContext.Provider>
    );
};

export default ListRequestsProvider;
