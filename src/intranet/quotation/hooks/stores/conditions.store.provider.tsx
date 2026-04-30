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
} from "./conditions.store";

const ConditionStoreContext = createContext<StoreApi<ConditionsStore> | null>(
  null,
);

export const ConditionStoreProvider: FC<
  PropsWithChildren<{ initialData?: Partial<ConditionState> }>
> = ({ children, initialData }) => {
  const [store] = useState(() => createConditionsStore(initialData)); //lazy initialization

  return (
    <ConditionStoreContext.Provider value={store}>
      {children}
    </ConditionStoreContext.Provider>
  );
};

export const useConditionStore = <T,>(
  selector: (state: ConditionsStore) => T,
) => {
  const store = useContext(ConditionStoreContext);
  if (!store) {
    throw new Error(
      "useConditionStore must be used inside ConditionStoreProvider",
    );
  }
  return useStore(store, selector);
};
