import type { QuotationProductIntention } from "../enum/order-inventory-intention";
import type { QuotationMessagesState } from "../enum/quotation-message-state.record";
import { type QuotationState } from "../enum/quotation-state.record";
import type { Truck } from "./create/order-trucks";

export interface Quotation {
  ID: number;
  version: number;
  nombre: string;
  id_solicitud: number;
  fecha_inicio: string;
  DNI_O_RUC: string;
  precio_total: string;
  estado: QuotationState;
  comentario_cliente?: string;
  fecha_emision: string | null;
  fecha_vigencia: string | null;
  observacion: string | null;
  Tasa_Cambio?: number;
  condiciones?: string;
  mensajes: QuotationMessagesState;
}

export interface QuotationDetails extends Quotation {
  productos: QuotationProduct[];
  camionEspecificado: Truck;
  costoRecojo: QuotationPickUpCosts;
  costoTotal: number;
  tasaCambio: QuotationExchangeRate;
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
