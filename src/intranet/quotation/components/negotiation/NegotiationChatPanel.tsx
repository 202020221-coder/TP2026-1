import { useEffect, useRef, useState, type FC, type FormEvent } from "react";
import { Send, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import type { NegotiationAuthorRole, NegotiationMessage } from "../../interfaces/negotiation-message";
import { useNegotiationChat } from "../../hooks/useNegotiationChat";

type NegotiationChatPanelProps = {
  quotationId: number;
  currentUserRole: NegotiationAuthorRole;
  currentUserName: string;
  counterpartyName: string;
  onClose: () => void;
};

export const NegotiationChatPanel: FC<NegotiationChatPanelProps> = ({
  quotationId,
  currentUserRole,
  currentUserName,
  counterpartyName,
  onClose,
}) => {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, isLoadingMessages, sendMessage, isSending } =
    useNegotiationChat(quotationId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isSending) return;

    await sendMessage({
      authorRole: currentUserRole,
      authorName: currentUserName,
      content: trimmed,
    });
    setDraft("");
  };

  const counterpartyInitials = counterpartyName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex shrink-0 items-center gap-3 border-b border-sky-100 bg-sky-50 px-4 py-3">
        <Avatar size="lg" className="border border-sky-200 bg-white">
          <AvatarFallback className="bg-sky-100 text-sky-800 text-xs font-semibold">
            {counterpartyInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {counterpartyName}
          </p>
          <p className="text-xs text-gray-500">Chat de negociación</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Cerrar chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </header>

      <ScrollArea className="min-h-0 flex-1 bg-gray-50 px-4 py-4">
        {isLoadingMessages ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-3/4 rounded-2xl" />
            <Skeleton className="ml-auto h-14 w-2/3 rounded-2xl" />
            <Skeleton className="h-14 w-4/5 rounded-2xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.authorRole === currentUserRole}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-end gap-2 border-t border-gray-100 bg-white p-4"
      >
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Redacta tus observaciones"
          rows={2}
          className="min-h-[52px] resize-none rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-sky-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!draft.trim() || isSending}
          className="h-11 w-11 shrink-0 rounded-xl bg-green-600 text-white hover:bg-green-700"
          aria-label="Enviar mensaje"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

const MessageBubble: FC<{
  message: NegotiationMessage;
  isOwn: boolean;
}> = ({ message, isOwn }) => {
  const time = new Date(message.createdAt).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start")}
    >
      <span className="px-1 text-[11px] font-medium text-gray-500">
        {message.authorName}
      </span>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isOwn
            ? "rounded-br-md bg-sky-600 text-white"
            : "rounded-bl-md border border-gray-200 bg-white text-gray-800",
        )}
      >
        {message.content}
      </div>
      <span className="px-1 text-[10px] text-gray-400">{time}</span>
    </div>
  );
};
