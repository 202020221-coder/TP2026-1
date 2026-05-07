import { createStore } from "zustand";
import { format } from "date-fns";

type State = {
  pickupCost: number;
  pickupDate: string;
  initialized: boolean;
};

type Actions = {
  update: <K extends keyof PickupState>(
    field: K,
    value: PickupState[K],
  ) => void;
  initialize: (data: PickupState) => void;
};

export type PickupState = Omit<State, "initialized">;
export type PickupStore = State & Actions;

const defaultState = (): PickupState => ({
  pickupCost: 0,
  pickupDate: format(new Date(), "yyyy-MM-dd"),
});

export const createPickupStore = (initialData?: PickupState) =>
  createStore<PickupStore>((set) => ({
    ...defaultState(),
    ...initialData,
    initialized: false,
    initialize: (data) => {
      set({ ...data, initialized: true });
    },
    update: (field, value) =>
      set(() => ({
        [field]: value,
      })),
  }));
