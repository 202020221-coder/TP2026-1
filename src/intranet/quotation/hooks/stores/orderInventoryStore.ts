import type { OrderInventoryTableElement } from "../../interfaces/create/order-inventory";
import { create } from "zustand";

type InventoryStore = {
  items: Record<OrderInventoryTableElement["id"], OrderInventoryTableElement>;

  initializeItems: (items: OrderInventoryTableElement[]) => void;

  updateItem: <K extends keyof OrderInventoryTableElement>(
    id: OrderInventoryTableElement["id"],
    field: K,
    value: OrderInventoryTableElement[K],
  ) => void;

  removeItem: (id: OrderInventoryTableElement["id"]) => void;

  addItems: (item: OrderInventoryTableElement[]) => void;
};

/* =========================
   STORE
========================= */

export const useOrderInventoryStore = create<InventoryStore>((set, get) => ({
  items: {},

  /* =========================
       INIT (fetch inicial)
    ========================= */
  initializeItems: (items) => {
    const current = get().items;

    // Evita reinicializar si ya hay datos
    if (Object.keys(current).length > 0) return;

    const mapped = Object.fromEntries(
      items.map((item) => [
        item.id,
        {
          ...item,
        },
      ]),
    );

    set({ items: mapped });
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
        newItems.map((item) => [item.id, item])
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
