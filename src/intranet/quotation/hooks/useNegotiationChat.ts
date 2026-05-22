import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  getQuotationChatHistory,
  type ChatMessage,
} from "../api/negotiation-chat.api";
import type { Quotation } from "../interfaces/quotation";
import { io, Socket } from "socket.io-client";
import { useSession } from "@/security/session/hooks/stores/useSession.store";

export const useNegotiationChat = (
  quotationID: Quotation["ID"]
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, _setIsSending] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const initializedRef = useRef(false);

  const accessToken = useSession((s) => s.accessToken);
  const user = useSession((s) => s.loggedUser);

  useEffect(() => {
    initializedRef.current = false;
    setMessages([]);
  }, [quotationID]);

  const initialMessagesQuery = useQuery({
    queryKey: ["initial", "messages", quotationID],
    queryFn: () => getQuotationChatHistory(quotationID),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (
      initialMessagesQuery.status === "success" &&
      !initializedRef.current
    ) {
      setMessages(initialMessagesQuery.data);
      initializedRef.current = true;
    }
  }, [initialMessagesQuery.status, initialMessagesQuery.data]);

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

    socket.on(
      "receive_message",
      (message: ChatMessage) => {
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m.id_mensaje === message.id_mensaje
          );

          if (exists) return prev;

          return [...prev, message];
        });
      }
    );

    socket.on("connect_error", (err) => {
      console.log(err.message);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [quotationID, accessToken]);

  const enviarMensaje = (message: string) => {
    if (!message.trim()) return;

    socketRef.current?.emit("send_message", {
      id_cotizacion: quotationID,
      mensaje: message,
      nombre_remitente: user?.nombres,
    });
  };

  return {
    messages,
    enviarMensaje,
    isSending,
    initialMessagesQuery,
  };
};