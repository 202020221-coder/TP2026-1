import { useContext } from "react";
import { ListInventarioContext } from "../context/ListInventarioContext";

export const useInventario = () => {
  const ctx = useContext(ListInventarioContext);
  if (!ctx) {
    throw new Error("useInventario debe usarse dentro de <ListInventarioProvider>");
  }
  return ctx;
};
