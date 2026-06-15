import type { QuotationProductIntention } from "../../enum/order-inventory-intention";
import type { QuotationState } from "../../enum/quotation-state.record";
import type { QuotationPhases } from "../phases.types";
export interface DesiredQuotationData {
  name: string;
  status: QuotationState;
  /** Día en que comienza el proyecto cotizado (yyyy-MM-dd). Desde esta fecha
   *  se calculan las fechas de cada etapa y de los servicios/subservicios. */
  projectStartDate: string;
  client: {
    DNIorRUC: string;
    comercialName: string;
    companyName: string; //razon social
  };
  inventory: QuotationProduct[];
  services: QuotationService[];
  trucks: QuotationTruck[];
  pickupService: QuotationPickupService;
  quotationConditions: QuotationCondition;
  quotationRate: {
    sellingRate: number;
    buyingRate: number;
  },
  phases: QuotationPhases;
}

interface QuotationTruck {
  plate: string;
  model: string;
  color: string;
  maintenanceDate: string;
  description: string;
  /** Id del servicio (COTIZACION_SERVICIO) en el que se usará el camión. */
  uso?: string | null;
  /** Fecha-hora de entrada (DATETIME; el día rige según el servicio). */
  fecha_hora_entrada?: string | null;
  /** Fecha-hora de salida (DATETIME; el día rige según el servicio). */
  fecha_hora_salida?: string | null;
}

interface QuotationService {
  id: string;
  name?: string;
  startDate: string; //ISO — se calcula según la etapa (no editable)
  dueDate: string; //   se calcula según la etapa (no editable)
  schedule: string; //campo de texto (jornada)
  unitPrice: number;
  /** true si es el servicio principal (abarca todo el proyecto). */
  isPrincipal?: boolean;
  /** Orden (1-based) de la etapa en la que ocurre el subservicio. null/undefined
   *  para el servicio principal (abarca todas las etapas). */
  faseOrden?: number | null;
  /** Si true, el pago es precio × días del servicio; si false, solo el precio. */
  pagoPorDia?: boolean;
}

interface QuotationPickupService {
  pickupCost: number;
  pickupDate: string;
  pickupAddress: string;
}

type QuotationProduct = {
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

interface QuotationCondition {
    emissionDate:string;
    expirationDate:string;
    conditions: string;
    observations: string;
}

// interface CreateQuotationBodyDTO {}

// interface UpdateQuotationBodyDTO {}
