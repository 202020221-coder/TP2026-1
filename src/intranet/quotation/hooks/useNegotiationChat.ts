import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  getQuotationChatHistory,
  type ChatMessage,
} from "../api/negotiation-chat.api";
import type { Quotation } from "../interfaces/quotation";
import { io, Socket } from "socket.io-client";
import { useSession } from "@/security/session/hooks/stores/useSession.store";

export const useNegotiationChat = (quotationID: Quotation["ID"]) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const queryClient = useQueryClient();

  const socketRef = useRef<Socket | null>(null);

  const accessToken = useSession((s) => s.accessToken);
  const user = useSession((s) => s.loggedUser);

  const refreshQuotationList = () => {
    queryClient.invalidateQueries({ queryKey: ["quotations"] });
    queryClient.invalidateQueries({ queryKey: ["initial", "messages"] });
  };

  const initialMessagesQuery = useQuery({
    queryKey: ["initial", "messages", quotationID],
    queryFn: () => getQuotationChatHistory(quotationID),
  });

  useEffect(() => {
    if (!initialMessagesQuery.data) return;

    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id_mensaje));
      const newMessages = initialMessagesQuery.data.filter(
        (m) => !existingIds.has(m.id_mensaje),
      );
      if (newMessages.length === 0) return prev;
      return [...prev, ...newMessages];
    });

    refreshQuotationList();
  }, [initialMessagesQuery.data]);

  useEffect(() => {
    if (messages.length === 0) return;
    queryClient.setQueryData(["initial", "messages", quotationID], messages);
  }, [messages, quotationID, queryClient]);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io("https://swefire.onrender.com", {
      auth: {
        token: accessToken,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("CONNECTED", socket.id);

      socket.emit("join_room", quotationID);
    });

    socket.on("receive_message", (message: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id_mensaje === message.id_mensaje);

        if (exists) return prev;

        return [...prev, message];
      });
      refreshQuotationList();
    });

    socket.on("connect_error", (err) => {
      console.log(err.message);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [quotationID, accessToken]);

  const sendMessage = (message: string) => {
    if (!message.trim()) return;

    socketRef.current?.emit("send_message", {
      id_cotizacion: quotationID,
      mensaje: message,
      nombre_remitente: user?.nombres,
    });
    refreshQuotationList();
  };

  return {
    messages,
    sendMessage,
    initialMessagesQuery,
  };
};
