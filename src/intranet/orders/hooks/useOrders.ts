import { useContext } from "react";
import { ListOrdersContext } from "../context/ListOrdersContext";

export const useOrders = () => {
  const ctx = useContext(ListOrdersContext);
  if (!ctx) {
    throw new Error(
      "Error: No se puede utilizar 'useTests' fuera de <TestContext.Provider>",
    );
  }
  return ctx;
};
