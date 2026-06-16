import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useEffect, useRef, type FC } from "react";
import { MessageBubble } from "./ChatMessageBubble";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import type { ChatMessage } from "../../api/negotiation-chat.api";
import { HandCoins } from "lucide-react";

interface ChatMessageQueueProps {
  isPending: boolean;
  messages: ChatMessage[];
  onUnreadCountChange?: (count: number) => void;
}

export const ChatMessageQueue: FC<ChatMessageQueueProps> = ({
  isPending,
  messages,
  onUnreadCountChange,
}) => {
  const user = useSession((s) => s.loggedUser);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!onUnreadCountChange) return;
    const count = messages.reduce((acc, m) => {
      const isOwn = m.id_remitente === user?.dni_perfil;
      const isUnread = !isOwn && m.leido === false;
      return acc + (isUnread ? 1 : 0);
    }, 0);
    onUnreadCountChange(count);
  }, [messages, user?.dni_perfil, onUnreadCountChange]);

  return (
    <ScrollArea className="min-h-0 flex-1 bg-gray-50 px-4 py-4 flex flex-col">
      {isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-3/4 rounded-2xl" />
          <Skeleton className="ml-auto h-14 w-2/3 rounded-2xl" />
          <Skeleton className="h-14 w-4/5 rounded-2xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {messages.length === 0 && (
            <div className="flex flex-col flex-1 items-center text-zinc-400">
              <HandCoins className="stroke-1" width={200} height={200} />
              <p>De el primer paso para obtener la mejor oferta posible!</p>
            </div>
          )}
          {messages.map((message) => {
            const isOwn = message.id_remitente === user?.dni_perfil;
            const isMessagePending = !isOwn && message.leido === false;
            return (
              <MessageBubble
                key={message.id_mensaje}
                message={message}
                isOwn={isOwn}
                isPending={isMessagePending}
              />
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}
    </ScrollArea>
  );
};
