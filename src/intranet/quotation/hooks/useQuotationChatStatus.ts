import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQuotationChatHistory } from "../api/negotiation-chat.api";
import type { Quotation } from "../interfaces/quotation";
import { resolveQuotationChatStatus } from "../lib/resolve-quotation-chat-status";
import { useSession } from "@/security/session/hooks/stores/useSession.store";

export const useQuotationChatStatus = (
  quotationId: Quotation["ID"],
  apiFallback: Pick<Quotation, "mensajes" | "chat">,
) => {
  const user = useSession((s) => s.loggedUser);

  const chatQuery = useQuery({
    queryKey: ["initial", "messages", quotationId],
    queryFn: () => getQuotationChatHistory(quotationId),
    enabled: quotationId > 0,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });

  const messageState = useMemo(
    () =>
      resolveQuotationChatStatus(
        chatQuery.data,
        user?.dni_perfil,
        apiFallback,
      ),
    [chatQuery.data, user?.dni_perfil, apiFallback],
  );

  return {
    messageState,
    isLoading: chatQuery.isPending,
  };
};
