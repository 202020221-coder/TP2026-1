import type { ChatMessage } from "../api/negotiation-chat.api";
import {
  normalizeQuotationMessageState,
  QuotationMessagesStatesRecord,
  type QuotationMessagesState,
} from "../enum/quotation-message-state.record";
import type { Quotation } from "../interfaces/quotation";
import { deriveChatStatusFromMessages } from "./derive-chat-status-from-messages";

export function resolveQuotationChatStatus(
  messages: ChatMessage[] | undefined,
  currentUserDni: string | undefined,
  apiFallback: Pick<Quotation, "mensajes" | "chat">,
): QuotationMessagesState {
  if (messages && messages.length > 0) {
    return deriveChatStatusFromMessages(messages, currentUserDni);
  }

  if (apiFallback.mensajes != null && apiFallback.mensajes !== "") {
    return normalizeQuotationMessageState(apiFallback.mensajes);
  }

  if (apiFallback.chat === "si") {
    return QuotationMessagesStatesRecord.pending;
  }

  return QuotationMessagesStatesRecord.not_started;
}
