import { createStore } from "zustand";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type Product = DesiredQuotationData["inventory"][number];

type State = {
  items: Record<Product["id"], Product>;
  initialized: boolean;
};

type Actions = {
  initialize: (items: Product[]) => void;
  updateItem: <K extends keyof Product>(
    id: Product["id"],
    field: K,
    value: Product[K],
  ) => void;
  removeItem: (id: Product["id"]) => void;
  addItems: (item: Product[]) => void;
  reset: () => void;
};

export type ProductsState = State;
export type ProductsStore = State & Actions;

export const createProductsStore = (initialProducts?: Product[]) =>
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
