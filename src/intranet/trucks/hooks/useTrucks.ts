import { useContext } from "react";
import { ListTrucksContext } from "../context/ListTrucksContext";

export const useTrucks = () => {
  const ctx = useContext(ListTrucksContext);
  if (!ctx) {
    throw new Error("useTrucks debe usarse dentro de <ListTrucksProvider>");
  }
  return ctx;
};
