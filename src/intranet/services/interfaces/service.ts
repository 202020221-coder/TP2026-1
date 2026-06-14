// ── Fases del Servicio ────────────────────────────────────────────────────────
// Mismo esquema que las fases de una cotización (QuotationPhase). Se mantiene
// estructuralmente idéntico para que sea compatible y se pueda autocompletar.
export interface ServicioFaseActividad {
  id: string;
  name: string;
}

export interface ServicioFase {
  id: string;
  name: string;
  description: string;
  duration: number;
  activities: ServicioFaseActividad[];
}

// ── Subservicios ──────────────────────────────────────────────────────────────
// Un subservicio es una referencia a otro servicio del catálogo que interviene
// dentro de una o más fases del servicio actual.
export interface ServicioSubservicio {
  /** Id del servicio referenciado como subservicio. */
  id: number;
  nombre: string;
  /** Ids de las fases (ServicioFase.id) en las que interviene el subservicio. */
  faseIds: string[];
  /** Días de alquiler requeridos (misma lógica que solicitudes/crear). */
  dias: number;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio_regular: number;
  condicional_precio: string;
  observaciones: string;
  /** URL o ruta de la imagen del servicio (según API). Null si no tiene. */
  foto: string | null;
  activo: boolean;
  /** Fases predeterminadas del servicio (mismo esquema que cotizaciones). */
  fases: ServicioFase[];
  /** Subservicios que intervienen en las fases del servicio. */
  subservicios: ServicioSubservicio[];
}

export interface CreateServicioDTO {
  nombre: string;
  descripcion: string;
  precio_regular: number;
  condicional_precio: string;
  observaciones: string;
}

export type UpdateServicioDTO = Partial<CreateServicioDTO & { activo: boolean }>;

// ── Personal Requerido ────────────────────────────────────────────────────────
export interface PersonalRequerido {
  id: number;
  ID_Servicio: number;
  profesion: string;
  cantidad: number;
  disponibilidad: string;
  requerimiento_legal: string;
}

export interface CreatePersonalRequeridoDTO {
  profesion: string;
  cantidad: number;
  disponibilidad: string;
  requerimiento_legal: string;
}

export type UpdatePersonalRequeridoDTO = Partial<CreatePersonalRequeridoDTO>;
