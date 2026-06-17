import { useState, type FC, type ReactNode } from "react";
import { type GetIncidentsQP } from "../interfaces/query-params.dto";
import { useQuery } from "@tanstack/react-query";
import { getAllIncidents } from "../api/incident.api";
import { ListIncidentsContext } from "./ListIncidentsContext";

export const ListIncidentsProvider: FC<{
  children: ReactNode;
  initialQueryParams?: Partial<GetIncidentsQP>;
  projectId?: number;
  clientId?: string;
}> = ({
  children,
  initialQueryParams,
  clientId,
}) => {
  const [queryParams, setQueryParams] = useState<GetIncidentsQP>({
    page: 1,
    limit: 10,
    ...initialQueryParams,
  });

  const result = useQuery({
    queryKey: ["incidents", queryParams],
    queryFn: () => getAllIncidents(queryParams),
  });

  const query = (queryParams: GetIncidentsQP) => {
    setQueryParams(queryParams);
  };

  return (
    <ListIncidentsContext.Provider value={{ result, query, queryParams, clientId }}>
      {children}
    </ListIncidentsContext.Provider>
  );
};
