import { createStore } from "zustand";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type Truck = DesiredQuotationData["trucks"][number];

type State = {
  selectedTrucks: Truck[];
  initialized: boolean;
};

type Actions = {
  setSelectedTrucks: (trucks: Truck[]) => void;
  addTruck: (truck: Truck) => void;
  removeTruck: (plate: Truck["plate"]) => void;
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
          (t) => t.plate === truck.plate,
        )
          ? state.selectedTrucks
          : [...state.selectedTrucks, truck],
      })),
    removeTruck: (plate) =>
      set((state) => ({
        selectedTrucks: state.selectedTrucks.filter((t) => t.plate !== plate),
      })),
  }));
