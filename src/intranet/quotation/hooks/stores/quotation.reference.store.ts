import { createStore } from "zustand";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type ReferenceData = Pick<DesiredQuotationData, "name" | "phases">;

interface State extends ReferenceData {
  initialized: boolean;
}

type Actions = {
  update: <K extends keyof ReferenceState>(
    field: K,
    value: ReferenceState[K],
  ) => void;
  initialize: (data: ReferenceState) => void;
  reset: () => void;
};

export type ReferenceState = Omit<State, "initialized">;
export type ReferenceStore = State & Actions;

const defaultState = (
  initialName?: State["name"],
  phase?: State["phases"],
): ReferenceState => ({
  name: initialName ?? "",
  phases: phase ?? {
    quantity: 1,
    duration: 1,
  },
});

export const createReferenceStore = (
  initialName?: string,
  phase?: State["phases"],
) =>
  createStore<ReferenceStore>((set) => ({
    ...defaultState(initialName, phase),
    initialized: false,
    update: (field, value) =>
      set(() => ({
        [field]: value,
      })),
    initialize: (data) => set({ ...data, initialized: true }),
    reset: () => set(defaultState(initialName)),
  }));
