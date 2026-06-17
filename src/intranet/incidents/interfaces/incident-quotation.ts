export type QuotationStatus =
  | "Pendiente"
  | "Enviado"
  | "Aprobado"
  | "Rechazado"
  | "Disputado"
  | "Pago realizado";

export type IncidentQuotationDestinatarioTipo =
  | "involucrado"
  | "empresa"
  | "no_especificado";

export interface IncidentQuotationDestinatarioOption {
  tipo: IncidentQuotationDestinatarioTipo;
  label: string;
  involucrado_id?: number;
  dni?: string;
  dni_o_ruc?: string;
  tiene_perfil?: boolean;
}

export interface IncidentQuotationDestinatariosResponse {
  incidencia: Record<string, unknown>;
  opciones: IncidentQuotationDestinatarioOption[];
}

export interface CreateIncidentQuotationDestinatarioBody {
  tipo: IncidentQuotationDestinatarioTipo;
  involucrado_id?: number;
  dni_o_ruc?: string;
}

export interface CreateIncidentQuotationBody {
  destinatario: CreateIncidentQuotationDestinatarioBody;
}

export interface CreateIncidentQuotationResponse {
  id: number;
  version: number;
  nombre: string;
  DNI_O_RUC: string;
  destinatario?: unknown;
  precio_total: number | string;
  presupuesto_autorrellenado?: unknown[];
  servicios?: unknown[];
}

export interface IncidentQuotation {
  id: number;
  id_incidencia?: number;
  nombre: string;
  version: number;
  desactualizado?: string;
  estado: QuotationStatus | string;
  precioTotal?: number | string | null;
  precio_subtotal?: number | null;
  nombreCliente?: string | null;
  destinatario?: string | null;
  fecha_emision?: string | null;
  fecha_envio?: string | null;
  esCotizacionIncidencia?: boolean;
  mensajes?: number;
  mensajes_pendientes?: number;
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
