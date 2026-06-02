import type { QuotationProductIntention } from "../enum/order-inventory-intention";
import { type QuotationState } from "../enum/quotation-state.record";

export interface Quotation {
  ID: number;
  nombre: string;
  precioTotal: string;
  condiciones: QuotationConditions;
  estado: QuotationState;
  tasaCambio: QuotationExchangeRate;
  version: number;
  /**solo visibles por el administrador */
  nombreCliente?: string;
  chat: "si" | "no";
}

export type QuotationProduct = {
  id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
} & (
  | {
      intencion: Extract<QuotationProductIntention, "comprar">;
      dias_alquilados: null;
    }
  | {
      intencion: Extract<QuotationProductIntention, "alquilar">;
      dias_alquilados: number;
    }
);

export interface QuotationPickUpCosts {
  costo: number;
  fechaRecojo: string;
  direccionRecojo: string;
}

export interface QuotationExchangeRate {
  tasaCompra: number;
  tasaVenta: number;
}

export type ServiceItem = {
  id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
};

export interface QuotationConditions {
  fechaEmision: string;
  fechaVigencia: string;
  condiciones: string;
  observaciones: string;
}
