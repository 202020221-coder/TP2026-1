import type { Truck } from "../../interfaces/create/order-trucks";
import { createStore } from "zustand";

type State = {
  selectedTruck?: Truck;
};

type Actions = {
  update: <K extends keyof State>(field: K, value: State[K]) => void;
};

export type TruckState = State;
export type TruckStore = State & Actions;

export const createTruckStore = (initialTruck?: Truck) =>
  createStore<TruckStore>((set) => ({
    selectedTruck: initialTruck,
    update: (field, value) =>
      set((state) => ({
        ...state,
        [field]: value,
      })),
  }));
