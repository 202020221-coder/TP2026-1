/**
 * Plazos de pago de una cotización (endpoint `/cotizaciones/{id}/detalles-franco`).
 *
 * `plazo_de_pago` es la cantidad de días DESPUÉS de finalizar el proyecto en los
 * que se debe pagar. Cuando vale 0, el pago se realiza ANTES de iniciar el
 * proyecto (pago por adelantado).
 */
export interface QuotationPaymentInstallment {
  id?: number;
  porcentaje: number;
  plazo_de_pago: number;
  orden: number;
}

export interface QuotationInitialPayment {
  porcentaje: number;
  plazo_de_pago: number;
}

export interface QuotationPaymentTerms {
  plazos_pago: QuotationPaymentInstallment[];
  pago_inicial: QuotationInitialPayment | null;
  requiere_confirmacion_pago_inicial: boolean;
}
