export const ProjectStatesRecord = {
  pending: "Pendiente",
  inExecution: "En ejecución",
  completed: "Completado",
  legalProcess: "En proceso legal",
} as const;

export type ProjectState =
  (typeof ProjectStatesRecord)[keyof typeof ProjectStatesRecord];
