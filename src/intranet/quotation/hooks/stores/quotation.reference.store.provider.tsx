import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useStore, type StoreApi } from "zustand";
import {
  createReferenceStore,
  type ReferenceState,
  type ReferenceStore,
} from "./quotation.reference.store";

const QuotationReferenceStoreContext =
  createContext<StoreApi<ReferenceStore> | null>(null);

export const QuotationReferenceStoreProvider: FC<
  PropsWithChildren<Partial<ReferenceState>>
> = ({ children, name, phases, projectStartDate }) => {
  const [store] = useState(() =>
    createReferenceStore(name, phases, projectStartDate),
  );
  return (
    <QuotationReferenceStoreContext.Provider value={store}>
      {children}
    </QuotationReferenceStoreContext.Provider>
  );
};

export const useQuotationReferenceStore = <T,>(
  selector: (store: ReferenceStore) => T,
) => {
  const store = useContext(QuotationReferenceStoreContext);
  if (!store) {
    throw new Error(
      "useQuotationReferenceStore must be used inside QuotationReferenceStoreProvider",
    );
  }
  return useStore(store, selector);
};
