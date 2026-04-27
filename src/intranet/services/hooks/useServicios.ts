import { useContext } from "react";
import { ListServiciosContext } from "../context/ListServiciosContext";

export const useServicios = () => {
  const ctx = useContext(ListServiciosContext);
  if (!ctx) {
    throw new Error(
      "Error: No se puede utilizar 'useServicios' fuera de <ListServiciosProvider>",
    );
  }
  return ctx;
};
