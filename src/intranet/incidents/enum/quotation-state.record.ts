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
  "Cotización sin respuesta",
  "Cotización disputada",
  "Pago por enviar",
  "Pago realizado",
] as const;

export type IncidentWorkflowState = (typeof IncidentWorkflowStates)[number];
