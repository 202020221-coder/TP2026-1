import type { QuotationState } from "../enum/quotation-state.record";
import type { QuotationMessagesState } from "../enum/quotation-message-state.record";
// import { z } from "zod";

export interface QuotationDetailForm {
  nombre: string;
  version: string;
  idSolicitud: string;
  dniOrRuc: string;
  fechaInicio: string;
  precioTotal: string;
  estado: QuotationState;
  mensajes: QuotationMessagesState;
  comentarioCliente: string;
}
