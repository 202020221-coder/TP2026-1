import type { QuotationProductIntention } from "../../enum/order-inventory-intention";
import type { QuotationState } from "../../enum/quotation-state.record";
import type { QuotationPhases } from "../phases.types";
export interface DesiredQuotationData {
  name: string;
  status: QuotationState;
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
  // Optional fields propagated from the source solicitud when a cotización
  // is created from an approved solicitud. All optional so existing callers
  // (e.g. cotización from incidencia, or plain creation) are unaffected.
  // Naming kept lowercase / consistent with PostRequestDTO so the backend
  // can reuse the same field handlers it uses for /solicitudes.
  productoenvio?: string;
  camionesenvio?: string;
  obsgenerales?: string;
  obseleccion?: string;
  medios?: QuotationSolicitudMedio[];
  fechaCreacionSolicitud?: string;
}

export interface QuotationSolicitudMedio {
  cliente_email: string;
  cliente_telefono: string;
}

interface QuotationTruck {
  plate: string;
  model: string;
  color: string;
  maintenanceDate: string;
  description: string;
}

interface QuotationService {
  id: string;
  name?: string;
  startDate: string; //ISO
  dueDate: string;
  schedule: string; //campo de texto (jornada)
  unitPrice: number;
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
