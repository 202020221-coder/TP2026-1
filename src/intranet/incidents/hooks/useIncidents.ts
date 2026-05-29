import { useContext } from "react";
import { ListIncidentsContext } from "../context/ListIncidentsContext";

export const useIncidents = () => {
  const ctx = useContext(ListIncidentsContext);
  if (!ctx) {
    throw new Error(
      "Error: No se puede utilizar 'useIncidents' fuera de <ListIncidentsContext.Provider>"
    );
  }
  return ctx;
};
