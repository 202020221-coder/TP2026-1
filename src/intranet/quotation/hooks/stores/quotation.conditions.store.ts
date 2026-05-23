import { createStore } from "zustand";
import { format, addDays } from "date-fns";

type State = {
  emissionDate: string;
  expirationDate: string;
  conditions: string;
  observaciones: string;
  initialized: boolean;
};

type Actions = {
  update: <K extends keyof ConditionState>(
    field: K,
    value: ConditionState[K],
  ) => void;
  initialize: (data: ConditionState) => void;
  reset: () => void;
};

export type ConditionsStore = State & Actions;
export type ConditionState = Omit<State, "initialized">;

const defaultState = () => ({
  emissionDate: format(new Date(), "yyyy-MM-dd"),
  expirationDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
  conditions: "",
  observaciones: "",
});

export const createConditionsStore = (initialData?: ConditionState) =>
  createStore<ConditionsStore>((set) => ({
    ...defaultState(),
    ...initialData,
    initialized: false,
    update: (field, value) =>
      set(() => ({
        [field]: value,
      })),
    initialize: (data) => set((s) => ({ ...s, ...data, initialized: true })),
    reset: () => set(defaultState),
  }));
