export type RequestState = "aceptado" | "pendiente" | "rechazado";

export const RequestStatesRecord: Record<RequestState, RequestState> = {
  aceptado: "aceptado",
  pendiente: "pendiente",
  rechazado: "rechazado",
};
