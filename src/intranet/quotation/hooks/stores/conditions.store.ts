import { createStore } from "zustand";
import { format, addDays } from "date-fns";

type State = {
  emissionDate: string;
  expirationDate: string;
  conditions: string;
};

type Actions = {
  update: <K extends keyof State>(field: K, value: State[K]) => void;
  setAll: (data: Partial<State>) => void;
  reset: () => void;
};

export type ConditionsStore = State & Actions;

const defaultState = () => ({
  emissionDate: format(new Date(), "yyyy-MM-dd"),
  expirationDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
  conditions: `Incluye combustible solo para el traslado y retorno al punto.\nSe requiere un espacio adecuado y protegido para la ubicación de las unidades de emergencia.\nEl costo no incluye IGV.\nEl costo está expresado en dólares.\nIncluye el sctr del personal piloto y bombero.\nNo incluye nada que no esté expresado en la cotización.\nPago al contado previo al servicio.`,
});

export const createConditionsStore = (initialData?: Partial<ConditionState>) =>
  createStore<ConditionsStore>((set) => ({
    ...defaultState(),
    ...initialData,
    update: (field, value) =>
      set(() => ({
        [field]: value,
      })),
    setAll: (data) => set((s) => ({ ...s, ...data })),
    reset: () => set(defaultState),
  }));

export type ConditionState = State;
