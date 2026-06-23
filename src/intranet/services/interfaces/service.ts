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
  /** Si true, el pago del subservicio es precio × días de su etapa. */
  pagoPorDia?: boolean;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio_regular: number;
  condicional_precio: string;
  observaciones: string;
  activo: boolean;
  /** Si true, el servicio solo aplica en cotizaciones de incidencia. */
  servicio_de_incidencia: boolean;
  /** Si true, el pago es precio × días en que ocurre el servicio. */
  pago_por_dia: boolean;
  /** Fases predeterminadas del servicio (mismo esquema que cotizaciones). */
  fases: ServicioFase[];
  /** Subservicios que intervienen en las fases del servicio. */
  subservicios: ServicioSubservicio[];
  foto: string | null
}

// ── Payload de guardado (PUT/POST /servicios) ─────────────────────────────────
// El servicio se guarda completo (incluyendo etapas/actividades y subservicios)
// en el mismo endpoint del servicio. Las etapas/actividades nuevas omiten `id`;
// las existentes lo incluyen. Un subservicio referencia su etapa por
// `id_servicio_etapa` (etapa existente) o por `orden_etapa` (etapa nueva).
export interface ServicioEtapaActividadPayload {
  id?: number;
  nombre: string;
  orden: number;
  name?:string;
}

export interface ServicioEtapaPayload {
  id?: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  orden: number;
  actividades: ServicioEtapaActividadPayload[];
}

export interface ServicioSubservicioPayload {
  id?: number;
  ID_Servicio_subservicio: number;
  id_servicio_etapa?: number;
  orden_etapa?: number;
}

export interface CreateServicioDTO {
  nombre: string;
  descripcion: string;
  precio_regular: number;
  condicional_precio: string;
  observaciones: string;
  /** Si true, en la cotización el pago es precio × días del servicio. */
  pago_por_dia?: boolean;
  /** YES = solo incidencias; NO = servicio normal. */
  servicio_de_incidencia?: "YES" | "NO";
  etapas?: ServicioEtapaPayload[];
  subservicios?: ServicioSubservicioPayload[];
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

// ── Inventario Requerido del Servicio ─────────────────────────────────────────
// Tabla: SERVICIO_INVENTARIO_REQUERIDO
// Clave compuesta: (ID_Servicio, Id_Objeto) — NO hay id autoincremental
// Endpoint: /servicios/{id}/inventario-requerido

export interface InventarioRequerido {
  // id = Id_Objeto (usado como identificador único en la UI)
  id: number;
  Id_Objeto: number;
  ID_Servicio: number;
  nombre_objeto: string;
  cantidad: number;
  estancia: string;         // ✏️ editable (antes llamado razon/metodo_traslado)
}

// POST: { Id_Objeto, cantidad, estancia }
export interface CreateInventarioObjetoRequeridoDTO {
  Id_Objeto: number;
  cantidad: number;          // backend valida > 0
  estancia: string;
}

// PUT: { cantidad, estancia }
export interface UpdateInventarioRequeridoDTO {
  cantidad?: number;
  estancia?: string;
}
