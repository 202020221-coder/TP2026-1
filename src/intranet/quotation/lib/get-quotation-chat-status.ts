import type { Quotation } from "../interfaces/quotation";
import { resolveQuotationChatStatus } from "./resolve-quotation-chat-status";

/** @deprecated Usar resolveQuotationChatStatus con historial de chat cuando esté disponible. */
export function getQuotationChatStatus(
  quotation: Pick<Quotation, "mensajes" | "chat">,
) {
  return resolveQuotationChatStatus(undefined, undefined, quotation);
}
