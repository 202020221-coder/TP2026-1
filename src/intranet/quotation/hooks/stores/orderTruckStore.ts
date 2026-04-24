import type { Pilot, Truck } from "../../interfaces/create/order-trucks";
import { create } from "zustand";

type State = {
  selectedTruckDriver?: Pilot;
  selectedTruck?: Truck;
};

type Actions = {
  update: <K extends keyof State>(field: K, value: State[K]) => void;
};

type UseTruckStore = State & Actions;

export const useTruck = create<UseTruckStore>((set) => ({
  selectedTruckDriverID: undefined,
  selectedTruckPlate: undefined,
  update: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
}));
