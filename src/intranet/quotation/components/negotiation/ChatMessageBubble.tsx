import type { FC } from "react";
import type { ChatMessage } from "../../api/negotiation-chat.api";
import { cn } from "@/shared/lib/utils";

export const MessageBubble: FC<{
  message: ChatMessage;
  isOwn: boolean;
}> = ({ message, isOwn }) => {
  const time = new Date(message.fecha_hora).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div
      className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isOwn
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-gray-200 bg-white text-gray-800",
        )}
      >
        {message.mensaje}
      </div>
      <span className="px-1 text-[10px] text-gray-400">{time}</span>
    </div>
  );
};
