export const IncidentStatesRecord = {
  sinEnviar: "Sin enviar",
  cotizacionSinRespuesta: "Cotizacion sin respuesta",
  cotizacionDisputada: "Cotizacion disputada",
  pagoPorRecibir: "Pago por recibir",
  pagoRealizado: "Pago realizado",
  materialRecuperado: "Material recuperado",
} as const;

export type IncidentState =
  (typeof IncidentStatesRecord)[keyof typeof IncidentStatesRecord];
