import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useEffect, useRef, type FC } from "react";
import { MessageBubble } from "./ChatMessageBubble";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import type { ChatMessage } from "../../api/negotiation-chat.api";

interface ChatMessageQueueProps {
  isPending: boolean;
  messages: ChatMessage[];
}

export const ChatMessageQueue: FC<ChatMessageQueueProps> = ({
  isPending,
  messages,
}) => {
  const user = useSession((s) => s.loggedUser);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <ScrollArea className="min-h-0 flex-1 bg-gray-50 px-4 py-4">
      {isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-3/4 rounded-2xl" />
          <Skeleton className="ml-auto h-14 w-2/3 rounded-2xl" />
          <Skeleton className="h-14 w-4/5 rounded-2xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble
              key={message.id_mensaje}
              message={message}
              isOwn={
                (message.tipo_remitente === "cliente" &&
                  user?.rol === RolesRecord.client) ||
                (message.tipo_remitente === "empleado" &&
                  user?.rol !== RolesRecord.client)
              }
            />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </ScrollArea>
  );
};
