import type { Truck } from "../../interfaces/create/order-trucks";
import { create } from "zustand";

type State = {
  selectedTruck?: Truck;
};

type Actions = {
  update: <K extends keyof State>(field: K, value: State[K]) => void;
};

type UseTruckStore = State & Actions;

export const useTruck = create<UseTruckStore>((set) => ({
  selectedTruck: undefined,
  update: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
}));
