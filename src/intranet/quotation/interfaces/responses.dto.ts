import type { Pagination } from "@/shared/interfaces/api-response";
import type { Client } from "./create/client";
import type { InventoryItem } from "./create/order-inventory";
import type { Truck } from "./create/order-trucks";
import type { Quotation } from "./quotation";
import type { QuotationPhases } from "./phases.types";
import type { Order } from "@/intranet/orders/interfaces/order";
export type GetQuotationsResponse = Pagination<Quotation[]>;

/**========================== INVENTORY CATALOG ======================== */
export type GetInventoryItemsResponse = Pagination<InventoryItem[]>;
export interface GetClientResponse extends Client {}

/**=================================CAMIONES==================================== */
export type GetAvailableTrucksResponse = Pagination<Truck[]>;

/**==================================CREATE QUOTATION============================ */
export type QuotationInventoryBody = {
  id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  intencion: "comprar" | "alquilar";
  dias_alquilados?: number | null;
  /**
   * Posición (0-based) del servicio en `services` al que se vincula el alquiler.
   * El backend usa el índice para resolver el FK `servicio_a_alquilar` y derivar
   * las fechas. Solo para `intencion: "alquilar"`.
   */
  serviceIndex?: number;
};

export type QuotationServiceBody = {
  id: string;
  name: string;
  startDate: string;
  dueDate: string;
  /** Hora de inicio de la jornada (HH:mm). */
  jornada_comienzo: string;
  /** Hora de fin de la jornada (HH:mm). */
  jornada_final: string;
  unitPrice: number;
  /** true si es el servicio principal (abarca todo el proyecto). */
  Principal: boolean;
  /** Orden (1-based) de la etapa del subservicio. Solo para no principales. */
  id_servicio_subservicio?: number;
  /** Si true, el pago es precio × días del servicio. */
  pago_por_dia?: boolean;
};

export type QuotationTruckBody = {
  plate: string;
  model: string;
  color: string;
  maintenanceDate: string;
  description: string;
  /**
   * Posición (0-based) del servicio en el array `services` al que se asigna el
   * camión. El backend usa este índice para resolver el PK de COTIZACION_SERVICIO
   * recién creado y asignarlo como `uso` del camión.
   */
  serviceIndex?: number;
  /** Entrada/salida del camión en formato MySQL DATETIME (YYYY-MM-DD HH:mm:ss). */
  fecha_hora_entrada?: string;
  fecha_hora_salida?: string;
};

/** Parte compartida del body para POST (crear) y PUT (actualizar). */
export type QuotationApiBody = {
  name: string;
  fecha_inicio_proyecto?: string;
  quotationConditions: {
    emissionDate: string;
    expirationDate: string;
    conditions: string;
    observations: string;
  };
  quotationRate: {
    buyingRate: number | null;
    sellingRate: number | null;
  };
  inventory: QuotationInventoryBody[];
  services: QuotationServiceBody[];
  trucks: QuotationTruckBody[];
  pickupService: {
    pickupCost: number;
    pickupDate: string;
    pickupAddress: string;
  };
  plazos_pago: {
    id?: number;
    porcentaje: number;
    plazo_de_pago: number;
    orden: number;
  }[];
  phases: QuotationPhases;
};

export type CreateQuotationBody = QuotationApiBody & {
  id_solicitud: Order["ID"];
  DNI_O_RUC: string;
  Id_incidencia?: number | null;
};
