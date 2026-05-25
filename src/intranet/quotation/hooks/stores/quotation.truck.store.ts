import type { Truck } from "../../interfaces/create/order-trucks";
import { createStore } from "zustand";

type State = {
  selectedTrucks: Truck[];
  initialized: boolean;
};

type Actions = {
  setSelectedTrucks: (trucks: Truck[]) => void;
  addTruck: (truck: Truck) => void;
  removeTruck: (placa: Truck["Placa"]) => void;
  initialize: (data: Pick<State, "selectedTrucks">) => void;
};

export type TruckState = Pick<State, "selectedTrucks">;
export type TruckStore = State & Actions;

export const createTruckStore = (initialData?: TruckState) =>
  createStore<TruckStore>((set) => ({
    selectedTrucks: initialData?.selectedTrucks ?? [],
    initialized: false,
    initialize: (data) => {
      set({ ...data, initialized: true });
    },
    setSelectedTrucks: (trucks) => set({ selectedTrucks: trucks }),
    addTruck: (truck) =>
      set((state) => ({
        selectedTrucks: state.selectedTrucks.some(
          (t) => t.Placa === truck.Placa,
        )
          ? state.selectedTrucks
          : [...state.selectedTrucks, truck],
      })),
    removeTruck: (placa) =>
      set((state) => ({
        selectedTrucks: state.selectedTrucks.filter(
          (t) => t.Placa !== placa,
        ),
      })),
  }));
