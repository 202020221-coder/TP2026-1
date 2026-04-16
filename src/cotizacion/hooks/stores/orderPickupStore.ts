import { create } from "zustand";
import { format } from "date-fns";

type State = {
  pickupCost: number;
  pickupDate: string;
};

type Actions = {
  update: <K extends keyof State>(field: K, value: State[K]) => void;
};

type OrderPickupStore = State & Actions;

export const useOrderPickup = create<OrderPickupStore>((set) => ({
  pickupCost: 0, 
  pickupDate: format(new Date(), "yyyy-MM-dd"),
  update: (field, value) =>
    set(() => ({
      [field]: value,
    })),
}));

export type PickupState = State