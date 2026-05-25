export interface Incident {
  id_incidencia: number;
  id_proyecto: number;
  empresa_involucrada: string;
  cotizacion_remuneracion: number | null;
  comentario: string;
  estado: IncidentState;
  Cotizacion_Nombre: string | null;
  Cliente_Nombre: string;
}

export interface IncidentObject {
  id: number;
  id_incidencia: number;
  tipo: string;
  descripcion: string;
}

export interface IncidentInvolved {
  id: number;
  id_incidencia: number;
  nombre: string;
  rol: string;
}

export type IncidentState = "Sin enviar" | "Enviado" | "En revisión" | "Cerrado";
