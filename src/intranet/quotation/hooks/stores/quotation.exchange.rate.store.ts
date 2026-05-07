import { createStore } from "zustand";
import type { ExchangeRate } from "../../api/exchange-rate.api";

type State = {
  rate: ExchangeRate | undefined;
  initialized: boolean;
};

type Actions = {
  initialize: (data: ExchangeRate) => void;
};

export type ExchangeRateState = Omit<State, "initialized">;
export type ExchangeRateStore = State & Actions;

export const createExchangeRateStore = (initialData?: ExchangeRateState) =>
  createStore<ExchangeRateStore>((set) => ({
    rate: initialData?.rate,
    initialized: false,
    initialize: (data) => {
      set({ rate:data, initialized: true });
    },
  }));
