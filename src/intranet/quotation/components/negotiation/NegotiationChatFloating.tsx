import { useMemo, useState, type FC } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { NegotiationChatPanel } from "./NegotiationChatPanel";
import { canNegotiateQuotation } from "../../lib/can-negotiate-quotation";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { useNegotiationChat } from "../../hooks/useNegotiationChat";
import type { QuotationState } from "../../enum/quotation-state.record";
import type { UserRole } from "@/security/session/interfaces/roles";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type NegotiationChatFloatingProps = {
  quotationId: number;
  quotationEstado: DesiredQuotationData["status"];
  contactName?: string;
  contactRole?: UserRole;
};

/**
 * Owns the chat connection so the unread badge stays accurate even when the
 * panel is closed. The panel itself is fed via `externalChat` to avoid
 * opening a second socket.
 */
const ActiveChatFloating: FC<NegotiationChatFloatingProps> = ({
  quotationId,
  contactName,
  contactRole,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSession((s) => s.loggedUser);
  const {
    messages,
    initialMessagesQuery: { isPending },
    sendMessage,
  } = useNegotiationChat(quotationId);

  const unreadCount = useMemo(() => {
    return messages.reduce((acc, m) => {
      const isOwn = m.id_remitente === user?.dni_perfil;
      const isUnread = !isOwn && m.leido === false;
      return acc + (isUnread ? 1 : 0);
    }, 0);
  }, [messages, user?.dni_perfil]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <NegotiationChatPanel
          quotationId={quotationId}
          onClose={() => setIsOpen(false)}
          contactName={contactName}
          contactRole={contactRole}
          externalChat={{ messages, isPending, sendMessage }}
        />
      )}

      <div className="relative">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl ring-2 ring-primary/30 hover:ring-primary/50 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
        {!isOpen && unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white shadow-md ring-2 ring-white"
            aria-label={`${unreadCount} mensajes sin leer`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};

export const NegotiationChatFloating: FC<NegotiationChatFloatingProps> = (
  props,
) => {
  const user = useSession((s) => s.loggedUser);

  const canChat = canNegotiateQuotation(
    { estado: props.quotationEstado as QuotationState },
    user?.rol,
  );

  if (!canChat) return null;

  // We only mount the active variant when the user can chat, so the
  // websocket from `useNegotiationChat` only opens for authorised users.
  return <ActiveChatFloating {...props} />;
};
