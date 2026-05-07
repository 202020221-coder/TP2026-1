import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useStore, type StoreApi } from "zustand";
import {
  createPickupStore,
  type PickupState,
  type PickupStore,
} from "./quotation.pickup.store";

const QuotationPickupStoreContext = createContext<StoreApi<PickupStore> | null>(
  null,
);

export const QuotationPickupStoreProvider: FC<
  PropsWithChildren<{
    initialData?: PickupState;
  }>
> = ({ children, initialData }) => {
  const [store] = useState(() => createPickupStore(initialData)); //lazy initialization
  return (
    <QuotationPickupStoreContext.Provider value={store}>
      {children}
    </QuotationPickupStoreContext.Provider>
  );
};

export const useQuotationPickupStore = <T,>(
  selector: (store: PickupStore) => T,
) => {
  const store = useContext(QuotationPickupStoreContext);
  if (!store) {
    throw new Error(
      "useQuotationPickupStore must be used inside QuotationPickupStoreProvider",
    );
  }
  return useStore(store, selector);
};
