import { createStore } from "zustand";
import { format, addDays } from "date-fns";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";
import {
  DEFAULT_PLAZOS_PAGO,
  updatePlazoPagoAtOrden,
  type QuotationPlazoPagoForm,
} from "../../lib/quotation-plazos-pago";

type ICondition = DesiredQuotationData["quotationConditions"];
interface State extends ICondition {
  initialized: boolean;
}

type Actions = {
  update: <K extends keyof ConditionState>(
    field: K,
    value: ConditionState[K],
  ) => void;
  updatePlazoPago: (
    orden: 1 | 2,
    patch: Partial<Pick<QuotationPlazoPagoForm, "porcentaje" | "plazo_de_pago">>,
  ) => void;
  initialize: (data: ConditionState) => void;
  reset: () => void;
};

export type ConditionsStore = State & Actions;
export type ConditionState = Omit<State, "initialized">;

const defaultState = (): ConditionState => ({
  emissionDate: format(new Date(), "yyyy-MM-dd"),
  expirationDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
  conditions: "",
  observations: "",
  plazosPago: DEFAULT_PLAZOS_PAGO,
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
    updatePlazoPago: (orden, patch) =>
      set((state) => ({
        plazosPago: updatePlazoPagoAtOrden(state.plazosPago, orden, patch),
      })),
    initialize: (data) => set((s) => ({ ...s, ...data, initialized: true })),
    reset: () => set(defaultState()),
  }));
