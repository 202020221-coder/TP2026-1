import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useStore, type StoreApi } from "zustand";
import {
  createTruckStore,
  type TruckState,
  type TruckStore,
} from "./quotation.truck.store";

const QuotationTruckStoreContext = createContext<StoreApi<TruckStore> | null>(
  null,
);

export const QuotationTruckStoreProvider: FC<
  PropsWithChildren<{ initialData?: TruckState }>
> = ({ children, initialData }) => {
  const [store] = useState(() => createTruckStore(initialData)); //lazy initialization

  return (
    <QuotationTruckStoreContext.Provider value={store}>
      {children}
    </QuotationTruckStoreContext.Provider>
  );
};

export const useQuotationTruckStore = <T,>(
  selector: (store: TruckStore) => T,
) => {
  const store = useContext(QuotationTruckStoreContext);
  if (!store) {
    throw new Error(
      "useQuotationTruckStore must be used inside QuotationTruckStoreProvider",
    );
  }
  return useStore(store, selector);
};
