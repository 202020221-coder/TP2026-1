import { useContext } from "react";
import { ListProjectsContext } from "../context/ListProjectsContext";

export const useProjects = () => {
  const ctx = useContext(ListProjectsContext);
  if (!ctx) {
    throw new Error(
      "Error: No se puede utilizar 'useProjects' fuera de <ListProjectsContext.Provider>"
    );
  }
  return ctx;
};
