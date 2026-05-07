import { useState, type FC, type ReactNode } from "react";
import { type GetProjectsQP } from "../interfaces/query-params.dto";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../api/project.api";
import { ListProjectsContext } from "./ListProjectsContext";

export const ListProjectsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryParams, setQueryParams] = useState<GetProjectsQP>({
    page: 1,
    limit: 10,
  });

  const result = useQuery({
    queryKey: ["projects", queryParams],
    queryFn: () => getAllProjects(queryParams),
  });

  const query = (queryParams: GetProjectsQP) => {
    setQueryParams(queryParams);
  };

  return (
    <ListProjectsContext.Provider value={{ result, query, queryParams }}>
      {children}
    </ListProjectsContext.Provider>
  );
};
