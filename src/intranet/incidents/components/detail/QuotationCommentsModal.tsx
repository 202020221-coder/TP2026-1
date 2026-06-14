import { useEffect, useRef, useState, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { getQuotationChatHistory, type ChatMessage } from "@/intranet/quotation/api/negotiation-chat.api";
import { io, type Socket } from "socket.io-client";

interface QuotationCommentsModalProps {
  quotationId: number;
  open: boolean;
  onClose: () => void;
}

export const QuotationCommentsModal: FC<QuotationCommentsModalProps> = ({
  quotationId,
  open,
  onClose,
}) => {
  const user = useSession((s) => s.loggedUser);
  const accessToken = useSession((s) => s.accessToken);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    setDraft("");
    setLoading(true);
    getQuotationChatHistory(quotationId)
      .then((data) => setMessages(data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [open, quotationId]);

  useEffect(() => {
    if (!open || !accessToken) return;

    const socket = io("https://swefire.onrender.com", {
      auth: { token: accessToken },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_room", String(quotationId));
    });

    socket.on("receive_message", (message: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id_mensaje === message.id_mensaje);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Chat socket error:", err.message);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [open, quotationId, accessToken]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    socketRef.current?.emit("send_message", {
      id_cotizacion: quotationId,
      mensaje: text,
      nombre_remitente: user?.nombres,
    });
    setDraft("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[600px] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="shrink-0 px-6 pt-5 pb-3 border-b border-border">
          <DialogTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Chat — Cotización #{quotationId}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/20">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-10">
              No hay mensajes. Inicia la conversación.
            </p>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.id_remitente === user?.dni_perfil;
              const time = new Date(msg.fecha_hora).toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div
                  key={msg.id_mensaje}
                  className={`flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}
                >
                  {!isOwn && (
                    <span className="text-[11px] text-muted-foreground px-1">
                      {msg.nombre_remitente}
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isOwn
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md border border-border bg-white text-foreground"
                    }`}
                  >
                    {msg.mensaje}
                  </div>
                  <span className="text-[10px] text-gray-400 px-1">{time}</span>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="shrink-0 flex items-end gap-2 border-t border-border bg-white px-4 py-3"
        >
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escribe un mensaje..."
            rows={2}
            className="min-h-[44px] resize-none rounded-xl bg-muted/30 border-border focus-visible:ring-primary text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!draft.trim()}
            className="h-11 w-11 shrink-0 rounded-xl"
            aria-label="Enviar mensaje"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
