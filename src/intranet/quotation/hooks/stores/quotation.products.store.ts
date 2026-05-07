import { createStore } from "zustand";
import type { QuotationProduct } from "../../interfaces/quotation";

type State = {
  items: Record<QuotationProduct["id"], QuotationProduct>;
  initialized: boolean;
};

type Actions = {
  initialize: (items: QuotationProduct[]) => void;
  updateItem: <K extends keyof QuotationProduct>(
    id: QuotationProduct["id"],
    field: K,
    value: QuotationProduct[K],
  ) => void;
  removeItem: (id: QuotationProduct["id"]) => void;
  addItems: (item: QuotationProduct[]) => void;
  reset: () => void;
};

export type ProductsState = State;
export type ProductsStore = State & Actions;

export const createProductsStore = (initialProducts?: QuotationProduct[]) =>
  createStore<ProductsStore>((set) => ({
    items: initialProducts
      ? Object.fromEntries(initialProducts.map((p) => [p.id, p]))
      : {},
    initialized: false,
    initialize: (items) => {
      const mapped = Object.fromEntries(
        items.map((item) => [
          item.id,
          {
            ...item,
          },
        ]),
      );

      set({ items: mapped, initialized: true });
    },

    /* =========================
       UPDATE
    ========================= */
    updateItem: (id, field, value) => {
      set((state) => {
        const existing = state.items[id];
        if (!existing) return state;

        return {
          items: {
            ...state.items,
            [id]: {
              ...existing,
              [field]: value,
            },
          },
        };
      });
    },

    /* =========================
       REMOVE (soft delete)
    ========================= */
    removeItem: (id) => {
      set((state) => {
        const newItems = { ...state.items };
        delete newItems[id];
        return {
          items: newItems,
        };
      });
    },

    /* =========================
       ADD / RESTORE
    ========================= */
    addItems: (newItems) => {
      set((state) => {
        const itemsToAdd = Object.fromEntries(
          newItems.map((item) => [item.id, item]),
        );
        return {
          items: {
            ...state.items,
            ...itemsToAdd,
          },
        };
      });
    },

    /* =========================
       RESET (opcional)
    ========================= */
    reset: () => set({ items: {} }),
  }));
