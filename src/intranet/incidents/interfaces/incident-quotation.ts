export type QuotationStatus = "Pendiente" | "Enviado" | "Rechazado" | "Aprobado";

export interface IncidentQuotation {
  id: number;
  id_incidencia: number;
  nombre: string;
  fecha_envio: string | null;
  version: number;
  precio_subtotal: number | null;
  estado: QuotationStatus;
  mensajes: number;
}

export type InvolvedObjectCategory = "Objetos" | "Camiones";

export interface InvolvedObject {
  id: number;
  id_incidencia: number;
  categoria: InvolvedObjectCategory;
  objeto: string;
  fecha_perdida: string | null;
  cantidad_involucrada: number;
  cantidad_enviada: number;
  ocurrencia: string;
  ultima_ubicacion: string;
  precio_remunerar: number | null;
}
