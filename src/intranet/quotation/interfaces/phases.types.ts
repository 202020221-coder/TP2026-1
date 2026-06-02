export interface QuotationPhaseActivity {
  id: string;
  name: string;
}

export interface QuotationPhase {
  id: string;
  name: string;
  description: string;
  duration: number;
  activities: QuotationPhaseActivity[];
}

export interface QuotationPhases {
  items: QuotationPhase[];
}
