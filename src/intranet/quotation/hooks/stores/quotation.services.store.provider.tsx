import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useStore, type StoreApi } from "zustand";
import {
  createServicesStore,
  type ServicesStore,
} from "./quotation.services.store";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

const QuotationServiceStoreContext =
  createContext<StoreApi<ServicesStore> | null>(null);

export const QuotationServiceStoreProvider: FC<
  PropsWithChildren<{ initialServices?: DesiredQuotationData["services"] }>
> = ({ children, initialServices }) => {
  const [store] = useState(() => createServicesStore(initialServices));

  return (
    <QuotationServiceStoreContext.Provider value={store}>
      {children}
    </QuotationServiceStoreContext.Provider>
  );
};

export const useQuotationServiceStore = <T,>(
  selector: (store: ServicesStore) => T,
) => {
  const store = useContext(QuotationServiceStoreContext);
  if (!store) {
    throw new Error(
      "useQuotationServiceStore must be used inside QuotationServiceStoreProvider",
    );
  }
  return useStore(store, selector);
};
