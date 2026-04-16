
import type { QuotationMessagesState } from "../enum/quotation-message-state.record";
import { type QuotationState } from "../enum/quotation-state.record";
export interface Quotation{
    ID: number;
    version:number;
    nombre: string;
    id_solicitud: number;
    fecha_inicio:string;
    DNI_O_RUC: string;
    precio_total:string;
    estado: QuotationState;
    comentario_cliente?: string;
    mensajes: QuotationMessagesState;
}