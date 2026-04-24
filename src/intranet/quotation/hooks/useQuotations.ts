import { useContext } from "react";
import { ListQuotationContext } from "../context/ListQuotationContext";


export const useQuotation = () => {
  const ctx = useContext(ListQuotationContext);
  if (!ctx) {
    throw new Error(
      "Error: No se puede utilizar 'useTests' fuera de <TestContext.Provider>",
    );
  }
  return ctx;
};
