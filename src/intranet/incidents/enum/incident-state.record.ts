export const IncidentStatesRecord = {
  sinEnviar: "Sin enviar",
  enviado: "Enviado",
  enRevision: "En revisión",
  cerrado: "Cerrado",
} as const;

export type IncidentState =
  (typeof IncidentStatesRecord)[keyof typeof IncidentStatesRecord];
