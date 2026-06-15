import { useMemo, useState, type FC } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { NegotiationChatPanel } from "./NegotiationChatPanel";
import { canNegotiateQuotation } from "../../lib/can-negotiate-quotation";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import type { QuotationState } from "../../enum/quotation-state.record";
import type { UserRole } from "@/security/session/interfaces/roles";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";
import { useQuery } from "@tanstack/react-query";
import { getQuotationChatHistory } from "../../api/negotiation-chat.api";
import { resolveQuotationChatStatus } from "../../lib/resolve-quotation-chat-status";
import { getFloatingChatButtonClass } from "../../lib/derive-chat-status-from-messages";

type NegotiationChatFloatingProps = {
  quotationId: number;
  quotationEstado: DesiredQuotationData["status"];
  contactName?: string;
  contactRole?: UserRole;
};

export const NegotiationChatFloating: FC<NegotiationChatFloatingProps> = ({
  quotationId,
  quotationEstado,
  contactName,
  contactRole,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSession((s) => s.loggedUser);

  const chatHistoryQuery = useQuery({
    queryKey: ["initial", "messages", quotationId],
    queryFn: () => getQuotationChatHistory(quotationId),
    enabled: !!quotationId,
    refetchOnWindowFocus: true,
  });

  const chatStatus = useMemo(
    () =>
      resolveQuotationChatStatus(
        chatHistoryQuery.data,
        user?.dni_perfil,
        { mensajes: undefined, chat: undefined },
      ),
    [chatHistoryQuery.data, user?.dni_perfil],
  );

  const canChat = canNegotiateQuotation(
    { estado: quotationEstado as QuotationState },
    user?.rol,
  );

  if (!canChat) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
          <NegotiationChatPanel
            quotationId={quotationId}
            onClose={() => setIsOpen(false)}
            contactName={contactName}
            contactRole={contactRole}
          />
      )}

      <Button
        size="icon"
        className={getFloatingChatButtonClass(chatStatus, isOpen)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};
