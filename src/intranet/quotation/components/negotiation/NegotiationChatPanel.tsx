import { useState, type FC, type ReactNode } from "react";
import { useNegotiationChat } from "../../hooks/useNegotiationChat";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { ChatMessageField } from "./ChatMessageField";
import { ChatHeader } from "./ChatHeader";
import type { UserRole } from "@/security/session/interfaces/roles";
import { ChatMessageQueue } from "./ChatMessageQueue";
import type { ChatMessage } from "../../api/negotiation-chat.api";

type ExternalChat = {
  messages: ChatMessage[];
  isPending: boolean;
  sendMessage: (message: string) => void;
};

type NegotiationChatPanelProps = {
  quotationId: number;
  onClose: () => void;
  contactName?: string;
  contactRole?: UserRole;
  onUnreadCountChange?: (count: number) => void;
  /**
   * Optional. When provided, the panel will use this chat data instead of
   * instantiating its own `useNegotiationChat` hook. This avoids duplicating
   * sockets when a parent already owns the chat connection.
   */
  externalChat?: ExternalChat;
};

/**
 * Internal wrapper that owns its own `useNegotiationChat` hook. Only used
 * when the panel was not given an `externalChat` prop, preserving the
 * panel's original behaviour for any standalone usage.
 */
const InternalChatProvider: FC<{
  quotationId: number;
  children: (chat: ExternalChat) => ReactNode;
}> = ({ quotationId, children }) => {
  const {
    messages,
    initialMessagesQuery: { isPending },
    sendMessage,
  } = useNegotiationChat(quotationId);
  return <>{children({ messages, isPending, sendMessage })}</>;
};

const PanelContent: FC<{
  chat: ExternalChat;
  onClose: () => void;
  propContactName?: string;
  propContactRole?: UserRole;
  onUnreadCountChange?: (count: number) => void;
}> = ({
  chat,
  onClose,
  propContactName,
  propContactRole,
  onUnreadCountChange,
}) => {
  const user = useSession((s) => s.loggedUser);
  const [unreadCount, setUnreadCount] = useState(0);

  let contactName = propContactName ?? "";
  let contactRole = propContactRole ?? (RolesRecord.client as UserRole);

  if (!contactName) {
    if (user?.rol === RolesRecord.client) {
      contactName =
        chat.messages.find((m) => m.tipo_remitente !== "cliente")
          ?.nombre_remitente ?? "";
      contactRole = RolesRecord.projectAdmin;
    } else {
      contactName =
        chat.messages.find((m) => m.tipo_remitente === "cliente")
          ?.nombre_remitente ?? "";
      contactRole = RolesRecord.client;
    }
  }

  const handleUnreadCountChange = (count: number) => {
    setUnreadCount(count);
    onUnreadCountChange?.(count);
  };

  return (
    <div className="flex h-[500px] w-[400px] min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <ChatHeader
        onCloseChat={onClose}
        contactName={contactName}
        contactRole={contactRole}
        unreadCount={unreadCount}
      />
      <ChatMessageQueue
        isPending={chat.isPending}
        messages={chat.messages}
        onUnreadCountChange={handleUnreadCountChange}
      />
      <ChatMessageField onSubmit={(message) => chat.sendMessage(message)} />
    </div>
  );
};

export const NegotiationChatPanel: FC<NegotiationChatPanelProps> = ({
  quotationId,
  onClose,
  contactName,
  contactRole,
  onUnreadCountChange,
  externalChat,
}) => {
  if (externalChat) {
    return (
      <PanelContent
        chat={externalChat}
        onClose={onClose}
        propContactName={contactName}
        propContactRole={contactRole}
        onUnreadCountChange={onUnreadCountChange}
      />
    );
  }

  return (
    <InternalChatProvider quotationId={quotationId}>
      {(chat) => (
        <PanelContent
          chat={chat}
          onClose={onClose}
          propContactName={contactName}
          propContactRole={contactRole}
          onUnreadCountChange={onUnreadCountChange}
        />
      )}
    </InternalChatProvider>
  );
};
