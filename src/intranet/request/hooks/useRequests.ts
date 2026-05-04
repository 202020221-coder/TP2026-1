import { useContext } from "react";
import { ListRequestContext } from "../context/ListRequestContext";

export const useRequests = () => {
  const ctx = useContext(ListRequestContext);
  if (!ctx) {
    throw new Error(
      "Error: No se puede utilizar 'useRequests' fuera de <ListRequestsProvider>",
    );
  }
  return ctx;
};

export default useRequests;
