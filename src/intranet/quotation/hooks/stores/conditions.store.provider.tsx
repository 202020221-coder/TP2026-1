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
} from "./conditions.store";

const ConditionStoreContext = createContext<StoreApi<ConditionsStore> | null>(
  null,
);

export const ConditionStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => createConditionsStore());//lazy initialization

  return (
    <ConditionStoreContext.Provider value={store}>
      {children}
    </ConditionStoreContext.Provider>
  );
};
