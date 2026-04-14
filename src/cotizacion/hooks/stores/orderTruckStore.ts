import { create } from "zustand";

type State = {
  selectedTruckDriverID?: string;
  selectedTruckPlate?: string;
};

type Actions = {
  update: <K extends keyof State>(field: K, value: State[K]) => void;
};

type UseTruckStore = State & Actions;

export const useTruck = create<UseTruckStore>((set) => ({
  selectedTruckDriverID: undefined,
  selectedTruckPlate: undefined,
  update: (field, value) => set({ [field]: value }),
}));
