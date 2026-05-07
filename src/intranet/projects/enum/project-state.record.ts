export const ProjectStatesRecord = {
  pending: "Pendiente",
  inExecution: "En Ejecución",
  completed: "Completado",
  legalProcess: "En proceso legal",
  cancelled: "Cancelado",
} as const;

export type ProjectState =
  (typeof ProjectStatesRecord)[keyof typeof ProjectStatesRecord];
