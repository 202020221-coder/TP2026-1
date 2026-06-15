import type { ChatMessage } from "../api/negotiation-chat.api";
import {
  QuotationMessagesStatesRecord,
  type QuotationMessagesState,
} from "../enum/quotation-message-state.record";

export function deriveChatStatusFromMessages(
  messages: ChatMessage[],
  currentUserDni: string | undefined,
): QuotationMessagesState {
  if (messages.length === 0) {
    return QuotationMessagesStatesRecord.not_started;
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.id_remitente !== currentUserDni) {
    return QuotationMessagesStatesRecord.pending;
  }

  return QuotationMessagesStatesRecord.sended;
}

export const getFloatingChatButtonClass = (
  state: QuotationMessagesState,
  isOpen: boolean,
): string => {
  if (isOpen) {
    return "h-14 w-14 rounded-full shadow-xl hover:shadow-2xl ring-2 ring-primary/30 hover:ring-primary/50 transition-all duration-200";
  }

  if (state === QuotationMessagesStatesRecord.pending) {
    return "h-14 w-14 rounded-full shadow-xl hover:shadow-2xl bg-red-600 hover:bg-red-700 ring-2 ring-red-300 hover:ring-red-400 transition-all duration-200";
  }

  if (state === QuotationMessagesStatesRecord.sended) {
    return "h-14 w-14 rounded-full shadow-xl hover:shadow-2xl bg-green-600 hover:bg-green-700 ring-2 ring-green-300 hover:ring-green-400 transition-all duration-200";
  }

  return "h-14 w-14 rounded-full shadow-xl hover:shadow-2xl bg-sky-600 hover:bg-sky-700 ring-2 ring-sky-300 hover:ring-sky-400 transition-all duration-200";
};
