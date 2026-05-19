export const QuotationMessagesStatesRecord = {
  sended: "Enviado",
  not_started: "No Iniciado",
  pending: "Pendiente",
} as const;

export type QuotationMessagesState =
  (typeof QuotationMessagesStatesRecord)[keyof typeof QuotationMessagesStatesRecord];

/** Etiquetas visibles en la columna Mensajes del listado. */
export const QuotationMessageStateLabels: Record<
  QuotationMessagesState,
  string
> = {
  [QuotationMessagesStatesRecord.not_started]: "Chat no iniciado",
  [QuotationMessagesStatesRecord.pending]: "Mensajes pendientes",
  [QuotationMessagesStatesRecord.sended]: "Mensaje enviado",
};

const canonicalValues = new Set<string>(
  Object.values(QuotationMessagesStatesRecord),
);

/** Acepta el valor crudo del API y lo convierte al estado interno. */
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

export const getQuotationMessageStateLabel = (raw: unknown): string => {
  const state = normalizeQuotationMessageState(raw);
  return QuotationMessageStateLabels[state];
};

export const getQuotationMessageStateBadgeClass = (
  raw: unknown,
): string => {
  const state = normalizeQuotationMessageState(raw);

  if (state === QuotationMessagesStatesRecord.sended) {
    return "border-green-300 bg-green-50 text-green-700";
  }
  if (state === QuotationMessagesStatesRecord.pending) {
    return "border-amber-300 bg-amber-50 text-amber-800";
  }
  return "border-sky-300 bg-sky-50 text-sky-800";
};
