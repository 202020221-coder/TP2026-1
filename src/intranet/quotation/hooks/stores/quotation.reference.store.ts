import { createStore } from "zustand";
import { format } from "date-fns";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type ReferenceData = Pick<
  DesiredQuotationData,
  "name" | "phases" | "projectStartDate"
>;

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
  projectStartDate?: State["projectStartDate"],
): ReferenceState => ({
  name: initialName ?? "",
  phases: phase ?? {
    items: [],
  },
  projectStartDate: projectStartDate || format(new Date(), "yyyy-MM-dd"),
});

export const createReferenceStore = (
  initialName?: string,
  phase?: State["phases"],
  projectStartDate?: State["projectStartDate"],
) =>
  createStore<ReferenceStore>((set) => ({
    ...defaultState(initialName, phase, projectStartDate),
    initialized: false,
    update: (field, value) =>
      set(() => ({
        [field]: value,
      })),
    initialize: (data) => set({ ...data, initialized: true }),
    reset: () => set(defaultState(initialName)),
  }));
