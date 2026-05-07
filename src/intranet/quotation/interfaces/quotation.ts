import type { Order } from "@/intranet/orders/interfaces/order";
import type { QuotationProductIntention } from "../enum/order-inventory-intention";
import type { QuotationMessagesState } from "../enum/quotation-message-state.record";
import { type QuotationState } from "../enum/quotation-state.record";
import type { Truck } from "./create/order-trucks";

export interface Quotation {
  ID: number;
  nombre: string;
  precioTotal: string;
  condiciones: QuotationConditions;
  estado: QuotationState;
  tasaCambio: QuotationExchangeRate;
  mensajes: QuotationMessagesState;
  version: number;
  /**solo visibles por el administrador */
  nombreCliente?: string;
}

export interface DetailedQuotation extends Omit<Quotation, "nombreCliente"> {
  productos: QuotationProduct[];
  camionEspecificado: Truck;
  costoRecojo: QuotationPickUpCosts;
  idSolicitud: Order["ID"];
}

export type QuotationProduct = {
  id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
} & (
  | {
      intencion: Extract<QuotationProductIntention, "comprar">;
      dias_alquilados:null;
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

export interface QuotationConditions {
  fechaEmision: string;
  fechaVigencia: string;
  condiciones: string;
  observaciones: string;
}
