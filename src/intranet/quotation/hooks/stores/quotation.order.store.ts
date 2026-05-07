import { createStore } from "zustand";
import type { DetailedOrder } from "@/intranet/orders/interfaces/order";

type State = {
  order: DetailedOrder | undefined;
  initialized: boolean;
};

type Actions = {
  update: <K extends keyof OrderState>(field: K, value: OrderState[K]) => void;
  initialize: (data: OrderState) => void;
};

export type OrderState = Omit<State, "initialized">;
export type OrderStore = State & Actions;

export const createOrderStore = (initialData?: OrderState) =>
  createStore<OrderStore>((set) => ({
    order: initialData?.order,
    initialized: false,
    initialize: (data) => {
      set({ ...data, initialized: true });
    },
    update: (field, value) =>
      set(() => ({
        [field]: value,
      })),
  }));
