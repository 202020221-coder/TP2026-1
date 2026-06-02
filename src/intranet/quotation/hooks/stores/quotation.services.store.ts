import { createStore } from "zustand";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type Service = DesiredQuotationData["services"][number];

type State = {
  items: Record<Service["id"], Service>;
  initialized: boolean;
};

type Actions = {
  initialize: (items: Service[]) => void;
  updateItem: <K extends keyof Service>(
    id: Service["id"],
    field: K,
    value: Service[K],
  ) => void;
  removeItem: (id: Service["id"]) => void;
  addItems: (item: Service[]) => void;
  reset: () => void;
};

export type ServicesState = State;
export type ServicesStore = State & Actions;

export const createServicesStore = (initialServices?: Service[]) =>
  createStore<ServicesStore>((set) => ({
    items: initialServices
      ? Object.fromEntries(initialServices.map((p) => [p.id, p]))
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
