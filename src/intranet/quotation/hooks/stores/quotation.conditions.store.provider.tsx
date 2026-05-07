import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useStore, type StoreApi } from "zustand";
import {
  createConditionsStore,
  type ConditionsStore,
  type ConditionState,
} from "./quotation.conditions.store";

const QuotationConditionStoreContext =
  createContext<StoreApi<ConditionsStore> | null>(null);

export const QuotationConditionStoreProvider: FC<
  PropsWithChildren<{ initialData?: ConditionState }>
> = ({ children, initialData }) => {
  const [store] = useState(() => createConditionsStore(initialData)); //lazy initialization

  return (
    <QuotationConditionStoreContext.Provider value={store}>
      {children}
    </QuotationConditionStoreContext.Provider>
  );
};

export const useQuotationConditionStore = <T,>(
  selector: (state: ConditionsStore) => T,
) => {
  const store = useContext(QuotationConditionStoreContext);
  if (!store) {
    throw new Error(
      "useConditionStore must be used inside ConditionStoreProvider",
    );
  }
  return useStore(store, selector);
};
