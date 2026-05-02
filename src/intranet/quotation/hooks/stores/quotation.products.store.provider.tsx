import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useStore, type StoreApi } from "zustand";
import {
  createProductsStore,
  type ProductsStore,
} from "./quotation.products.store";
import type { QuotationProduct } from "../../interfaces/quotation";

const QuotationProductStoreContext =
  createContext<StoreApi<ProductsStore> | null>(null);

export const QuotationProductStoreProvider: FC<
  PropsWithChildren<{ initialProducts?: QuotationProduct[] }>
> = ({ children, initialProducts }) => {
  const [store] = useState(() => createProductsStore(initialProducts)); //lazy initialization

  return (
    <QuotationProductStoreContext.Provider value={store}>
      {children}
    </QuotationProductStoreContext.Provider>
  );
};

export const useQuotationProductStore = <T,>(
  selector: (store: ProductsStore) => T,
) => {
  const store = useContext(QuotationProductStoreContext);
  if (!store) {
    throw new Error(
      "useQuotationProductStore must be used inside QuotationProductStoreProvider",
    );
  }
  return useStore(store, selector);
};
