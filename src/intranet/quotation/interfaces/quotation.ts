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
  /** Ruta relativa del PDF de orden de compra (ej. /uploads/cotizaciones/...) */
  ordenCompra?: string | null;
  /** true cuando hay OC subida y falta aprobar para crear el proyecto */
  pendienteAprobacionOrden?: boolean;
  /** Estado del chat según el API: "Pendiente" | "No Iniciado" | "Enviado" */
  mensajes?: string | null;
  /** Fallback legacy del API cuando no viene `mensajes` */
  chat?: "si" | "no";
}

export type QuotationProduct = {
  id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  /**
   * Id del servicio (catálogo) al que se vincula un ítem en alquiler para que el
   * backend derive las fechas de alquiler vía FK (servicio_a_alquilar). Solo
   * aplica a `intencion: "alquilar"`. null/undefined = alquiler manual.
   */
  uso?: string | null;
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
