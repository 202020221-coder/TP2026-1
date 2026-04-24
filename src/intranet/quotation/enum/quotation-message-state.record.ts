export const QuotationMessagesStatesRecord = {
  sended: "Enviado",
  not_started: "No Iniciado",
  pending: "Pendiente",
} as const;

export type QuotationMessagesState = (typeof QuotationMessagesStatesRecord)[keyof typeof QuotationMessagesStatesRecord];
