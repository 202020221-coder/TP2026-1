import type { Truck } from "../../interfaces/create/order-trucks";
import { createStore } from "zustand";

type State = {
  selectedTruck?: Truck;
  initialized: boolean;
};

type Actions = {
  update: <K extends keyof TruckState>(field: K, value: TruckState[K]) => void;
  initialize: (data: TruckState) => void;
};

export type TruckState = Omit<State, "initialized">;
export type TruckStore = State & Actions;

export const createTruckStore = (initialData?: TruckState) =>
  createStore<TruckStore>((set) => ({
    selectedTruck: initialData?.selectedTruck ?? undefined,
    initialized: false,
    initialize: (data) => {
      set({ ...data, initialized: true });
    },
    update: (field, value) =>
      set((state) => ({
        ...state,
        [field]: value,
      })),
  }));
