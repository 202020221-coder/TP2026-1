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

/** Respuesta cruda de `GET /incidencias/{id}/involucrados`. */
export interface IncidentInvolvedRaw {
  id: number;
  dni_involucrado: string | null;
  id_trabajo: number | null;
  id_incidencia: number;
  descargo: string | null;
  comentario: string | null;
  nombre: string | null;
  Perfil_Registrado: string | null;
  Trabajo_Comentario: string | null;
  Involucrado_Nombre: string | null;
  Involucrado_Apellido: string | null;
}

/** Modelo normalizado usado en la UI. */
export interface IncidentInvolved {
  id: number;
  id_incidencia: number;
  id_trabajo: number | null;
  dni: string | null;
  nombre: string;
  cargo: string | null;
  descargo_persona: string;
  comentario_empresa: string;
  trabajo_comentario: string;
  tiene_relacion_empresa: boolean;
  perfil_registrado: string | null;
}

export type IncidentState = "Sin enviar" | "Enviado" | "En revisión" | "Cerrado";
