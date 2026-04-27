import { useState, type FC, type ReactNode } from "react";
import { type GetServiciosQP } from "../interfaces/query-params.dto";
import { useQuery } from "@tanstack/react-query";
import { getServicios } from "../api/service.api";
import { ListServiciosContext } from "./ListServiciosContext";

export const ListServiciosProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryParams, setQueryParams] = useState<GetServiciosQP>({
    page: 1,
    limit: 10,
  });

  const result = useQuery({
    queryKey: ["servicios", queryParams],
    queryFn: () => getServicios(queryParams),
  });

  const query = (params: GetServiciosQP) => {
    setQueryParams(params);
  };

  return (
    <ListServiciosContext.Provider value={{ result, query, queryParams }}>
      {children}
    </ListServiciosContext.Provider>
  );
};
