import { type FC } from "react";
import { useNegotiationChat } from "../../hooks/useNegotiationChat";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { ChatMessageField } from "./ChatMessageField";
import { ChatHeader } from "./ChatHeader";
import type { UserRole } from "@/security/session/interfaces/roles";
import { ChatMessageQueue } from "./ChatMessageQueue";

type NegotiationChatPanelProps = {
  quotationId: number;
  onClose: () => void;
  contactName?: string;
  contactRole?: UserRole;
};

export const NegotiationChatPanel: FC<NegotiationChatPanelProps> = ({
  quotationId,
  onClose,
  contactName: propContactName,
  contactRole: propContactRole,
}) => {
  const user = useSession((s) => s.loggedUser);
  const {
    messages,
    initialMessagesQuery: { isPending },
    sendMessage,
  } = useNegotiationChat(quotationId);

  let contactName = propContactName ?? "";
  let contactRole = propContactRole ?? (RolesRecord.client as UserRole);

  if (!contactName) {
    if (user?.rol === RolesRecord.client) {
      contactName =
        messages.find((m) => m.tipo_remitente !== "cliente")
          ?.nombre_remitente ?? "";
      contactRole = RolesRecord.projectAdmin;
    } else {
      contactName =
        messages.find((m) => m.tipo_remitente === "cliente")
          ?.nombre_remitente ?? "";
      contactRole = RolesRecord.client;
    }
  }

  return (
    <div className="flex h-[500px] w-[400px] min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <ChatHeader
        onCloseChat={onClose}
        contactName={contactName}
        contactRole={contactRole}
      />
      <ChatMessageQueue isPending={isPending} messages={messages} />
      <ChatMessageField onSubmit={(message) => sendMessage(message)} />
    </div>
  );
};
