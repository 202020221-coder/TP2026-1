import {
  createContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { type StoreApi } from "zustand";
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
