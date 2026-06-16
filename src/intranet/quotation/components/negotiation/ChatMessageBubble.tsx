import type { FC } from "react";
import type { ChatMessage } from "../../api/negotiation-chat.api";
import { cn } from "@/shared/lib/utils";

export const MessageBubble: FC<{
  message: ChatMessage;
  isOwn: boolean;
  isPending?: boolean;
}> = ({ message, isOwn, isPending = false }) => {
  const time = new Date(message.fecha_hora).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const highlightPending = isPending && !isOwn;

  return (
    <div className="flex w-full flex-col gap-1">
      <div
        className={cn(
          "flex max-w-[350px] flex-col wrap-break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isOwn
            ? "self-end rounded-br-md bg-primary text-primary-foreground"
            : highlightPending
              ? "self-start rounded-bl-md border border-gray-200 border-l-4 border-amber-400 bg-amber-50 text-gray-800"
              : "self-start rounded-bl-md border border-gray-200 bg-white text-gray-800",
        )}
      >
        {message.mensaje}
      </div>
      <span
        className={cn(
          "px-1 text-[10px] text-gray-400",
          isOwn ? "self-end" : "self-start",
        )}
      >
        {time}
      </span>
    </div>
  );
};
