import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNegotiationMessages,
  sendNegotiationMessage,
} from "../api/negotiation-chat.api";
import type { NegotiationAuthorRole } from "../interfaces/negotiation-message";

export const negotiationChatQueryKey = (quotationId: number) =>
  ["quotation", "negotiation-chat", quotationId] as const;

export function useNegotiationChat(quotationId: number) {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: negotiationChatQueryKey(quotationId),
    queryFn: () => getNegotiationMessages(quotationId),
    enabled: Number.isFinite(quotationId) && quotationId > 0,
  });

  const sendMutation = useMutation({
    mutationFn: sendNegotiationMessage,
    onSuccess: (message) => {
      queryClient.setQueryData(
        negotiationChatQueryKey(quotationId),
        (current: typeof messagesQuery.data) => [...(current ?? []), message],
      );
    },
  });

  const sendMessage = async (payload: {
    authorRole: NegotiationAuthorRole;
    authorName: string;
    content: string;
  }) => {
    await sendMutation.mutateAsync({
      quotationId,
      ...payload,
    });
  };

  return {
    messages: messagesQuery.data ?? [],
    isLoadingMessages: messagesQuery.isPending,
    messagesError: messagesQuery.error,
    sendMessage,
    isSending: sendMutation.isPending,
  };
}
