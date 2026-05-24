import { createStore } from "zustand";

type State = {
  name: string;
  initialized: boolean;
};

type Actions = {
  update: <K extends keyof ReferenceState>(field: K, value: ReferenceState[K]) => void;
  initialize: (data: ReferenceState) => void;
  reset: () => void;
};

export type ReferenceState = Omit<State, "initialized">;
export type ReferenceStore = State & Actions;

const defaultState = (initialName?: string): ReferenceState => ({
  name: initialName ?? "",
});

export const createReferenceStore = (initialName?: string) =>
  createStore<ReferenceStore>((set) => ({
    ...defaultState(initialName),
    initialized: false,
    update: (field, value) =>
      set(() => ({
        [field]: value,
      })),
    initialize: (data) => set({ ...data, initialized: true }),
    reset: () => set(defaultState(initialName)),
  }));
