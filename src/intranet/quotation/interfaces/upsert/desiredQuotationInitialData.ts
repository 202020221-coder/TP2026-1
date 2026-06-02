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
