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
  /**solo visibles por el administrador */
  version?: number;
  nombreCliente?: string;
}

export interface DetailedQuotation extends Omit<Quotation, "nombreCliente"> {
  productos: QuotationProduct[];
  camionEspecificado: Truck;
  costoRecojo: QuotationPickUpCosts;
  idSolicitud:Order["ID"];
}

export interface QuotationProduct {
  id: string;
  nombre: string;
  intencion: QuotationProductIntention;
  cantidad: number;
  precio_unitario: number;
}

interface QuotationPickUpCosts {
  costo: number;
  fechaRecojo: string;
  direccionRecojo: string;
}

interface QuotationExchangeRate {
  tasaCompra: number;
  tasaVenta: number;
}

interface QuotationConditions {
  fechaEmision: string;
  fechaVigencia: string;
  condiciones:string;
  observaciones:string;
}