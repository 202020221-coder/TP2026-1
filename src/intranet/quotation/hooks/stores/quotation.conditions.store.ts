import { createStore } from "zustand";
import { format, addDays } from "date-fns";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type ICondition = DesiredQuotationData["quotationConditions"];
interface State extends ICondition {
  initialized: boolean;
}

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
  observations: "",
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
