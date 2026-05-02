import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useStore, type StoreApi } from "zustand";
import { createTruckStore, type TruckStore } from "./quotation.truck.store";
import type { Truck } from "../../interfaces/create/order-trucks";

const QuotationTruckStoreContext = createContext<StoreApi<TruckStore> | null>(
  null,
);

export const QuotationTruckStoreProvider: FC<
  PropsWithChildren<{ initialTruck?: Truck }>
> = ({ children, initialTruck }) => {
  const [store] = useState(() => createTruckStore(initialTruck)); //lazy initialization

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
