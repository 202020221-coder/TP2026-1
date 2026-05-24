import { useState, type FC } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { NegotiationChatPanel } from "./NegotiationChatPanel";
import { canNegotiateQuotation } from "../../lib/can-negotiate-quotation";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import type { QuotationState } from "../../enum/quotation-state.record";
import type { UserRole } from "@/security/session/interfaces/roles";

type NegotiationChatFloatingProps = {
  quotationId: number;
  quotationEstado: string;
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
    </div>
  );
};
