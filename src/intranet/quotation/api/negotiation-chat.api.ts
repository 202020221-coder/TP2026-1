import axiosInstance from "@/shared/api/axios.config";
import type { Quotation } from "../interfaces/quotation";
export const getQuotationChatHistory = async (quotationId: Quotation["ID"]) => {
  const response = await axiosInstance.get<ChatMessage[]>(
    `/cotizaciones/${quotationId}/chat`,
  );
  return response.data;
};

export interface ChatMessage {
  id_mensaje: number;
  id_cotizacion: number;
  id_remitente: string;
  tipo_remitente: string;
  nombre_remitente: string;
  mensaje: string;
  fecha_hora: string;
}
