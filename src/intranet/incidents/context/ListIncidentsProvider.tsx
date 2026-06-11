import { useState, type FC, type ReactNode } from "react";
import { type GetIncidentsQP } from "../interfaces/query-params.dto";
import { useQuery } from "@tanstack/react-query";
import { getAllIncidents, getIncidentsByProject } from "../api/incident.api";
import { ListIncidentsContext } from "./ListIncidentsContext";

export const ListIncidentsProvider: FC<{
  children: ReactNode;
  initialQueryParams?: Partial<GetIncidentsQP>;
  projectId?: number;
}> = ({
  children,
  initialQueryParams,
  projectId,
}) => {
  const [queryParams, setQueryParams] = useState<GetIncidentsQP>({
    page: 1,
    limit: 10,
    ...initialQueryParams,
  });

  const hasProjectFilter = Boolean(projectId && projectId > 0);

  const result = useQuery({
    queryKey: hasProjectFilter
      ? ["incidents", "project", projectId]
      : ["incidents", queryParams],
    queryFn: hasProjectFilter
      ? () => getIncidentsByProject(projectId!)
      : () => getAllIncidents(queryParams),
  });

  const query = (queryParams: GetIncidentsQP) => {
    setQueryParams(queryParams);
  };

  return (
    <ListIncidentsContext.Provider value={{ result, query, queryParams }}>
      {children}
    </ListIncidentsContext.Provider>
  );
};
