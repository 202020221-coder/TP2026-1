export const QuotationMessagesStatesRecord = {
  sended: "Enviado",
  not_started: "No Iniciado",
  pending: "Pendiente",
} as const;

export type QuotationMessagesState =
  (typeof QuotationMessagesStatesRecord)[keyof typeof QuotationMessagesStatesRecord];

export const QuotationMessageStateLabels: Record<
  QuotationMessagesState,
  string
> = {
  [QuotationMessagesStatesRecord.not_started]: "Chat no iniciado",
  [QuotationMessagesStatesRecord.pending]: "Mensajes pendientes",
  [QuotationMessagesStatesRecord.sended]: "Abrir chat",
};

const canonicalValues = new Set<string>(
  Object.values(QuotationMessagesStatesRecord),
);

export function normalizeQuotationMessageState(
  raw: unknown,
): QuotationMessagesState {
  if (raw == null || raw === "") {
    return QuotationMessagesStatesRecord.not_started;
  }

  if (typeof raw === "string" && canonicalValues.has(raw)) {
    return raw as QuotationMessagesState;
  }

  const value = String(raw).toLowerCase().trim();

  if (
    value.includes("enviad") ||
    value === "sent" ||
    value === "sended" ||
    value === "mensaje enviado"
  ) {
    return QuotationMessagesStatesRecord.sended;
  }

  if (
    value.includes("pendient") ||
    value === "pending" ||
    value.includes("mensajes pendientes")
  ) {
    return QuotationMessagesStatesRecord.pending;
  }

  if (
    value.includes("no iniciado") ||
    value.includes("no_iniciado") ||
    value.includes("chat no iniciado") ||
    value === "not_started" ||
    value === "not started"
  ) {
    return QuotationMessagesStatesRecord.not_started;
  }

  return QuotationMessagesStatesRecord.not_started;
}

export const getQuotationMessageStateBadgeClass = (
  state: QuotationMessagesState,
): string => {
  if (state === QuotationMessagesStatesRecord.sended) {
    return "border-green-300 bg-green-50 text-green-700 focus-visible:ring-green-400";
  }
  if (state === QuotationMessagesStatesRecord.pending) {
    return "border-red-300 bg-red-50 text-red-700 focus-visible:ring-red-400";
  }
  return "border-sky-300 bg-sky-50 text-sky-800 focus-visible:ring-sky-400";
};

export const getQuotationMessageStateTooltipClass = (
  state: QuotationMessagesState,
): string => {
  if (state === QuotationMessagesStatesRecord.sended) {
    return "border-green-500 text-green-600";
  }
  if (state === QuotationMessagesStatesRecord.pending) {
    return "border-red-500 text-red-600";
  }
  return "border-sky-500 text-sky-600";
};

export const getQuotationMessageStateTooltipLabel = (
  state: QuotationMessagesState,
): string => {
  if (state === QuotationMessagesStatesRecord.sended) {
    return "No tienes mensajes pendientes por responder";
  }
  if (state === QuotationMessagesStatesRecord.pending) {
    return "Tienes mensajes pendientes por responder";
  }
  return "Abrir chat por primera vez";
};
