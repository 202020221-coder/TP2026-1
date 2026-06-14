export const QuotationStatesRecord = {
  pendiente: "Pendiente",
  enviado: "Enviado",
  rechazado: "Rechazado",
  aprobado: "Aprobado",
  disputado: "Disputado",
  pagoRealizado: "Pago realizado",
} as const;

export type QuotationState =
  (typeof QuotationStatesRecord)[keyof typeof QuotationStatesRecord];

export const IncidentWorkflowStates = [
  "Sin enviar",
  "Cotizacion sin respuesta",
  "Cotizacion disputada",
  "Pago por recibir",
  "Pago realizado",
  "Material recuperado",
] as const;

export type IncidentWorkflowState = (typeof IncidentWorkflowStates)[number];
