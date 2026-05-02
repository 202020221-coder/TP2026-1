import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useStore, type StoreApi } from "zustand";
import {
  createExchangeRateStore,
  type ExchangeRateState,
  type ExchangeRateStore,
} from "./quotation.exchange.rate.store";

const QuotationExchangeRateContext =
  createContext<StoreApi<ExchangeRateStore> | null>(null);

export const QuotationExchangeRateProvider: FC<
  PropsWithChildren<{
    initialData?: ExchangeRateState;
  }>
> = ({ children, initialData }) => {
  const [store] = useState(() => createExchangeRateStore(initialData)); //lazy initialization
  return (
    <QuotationExchangeRateContext.Provider value={store}>
      {children}
    </QuotationExchangeRateContext.Provider>
  );
};

export const useQuotationExchangeRate = <T,>(
  selector: (store: ExchangeRateStore) => T,
) => {
  const store = useContext(QuotationExchangeRateContext);
  if (!store) {
    throw new Error(
      "useQuotationExchangeRate must be used inside QuotationExchangeRateProvider",
    );
  }
  return useStore(store, selector);
};
