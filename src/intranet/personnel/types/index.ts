// Domain types for the "Gestionar Personal" module.
// Field names mirror the backend `/api/perfiles` Swagger contract EXACTLY
// (the request/response bodies use this casing — do not rename).

/** Estado of a profile as modeled by the backend (`estado` enum). */
export type EstadoPersonal = "inhabilitado" | "en trabajo" | "disponible";

/** Backend `seguro_vida_ley` enum. */
export type SeguroVidaLey = "si" | "no";

/** Backend roles (perfiles.rol). */
export type RolPersonal =
  | "gerente"
  | "cliente"
  | "supervisorcampo"
  | "asistproy"
  | "trabajcampo"
  | "abogado"
  | "trabajtaller";

/**
 * Body sent to create/update a profile.
 * Matches `POST/PUT /api/perfiles/personal/{id}` exactly.
 * (DNI travels in the path on create, so it is not part of this body.)
 */
export interface PersonalInput {
  Nombre: string;
  Apellido: string;
  Genero?: string;
  RUC?: string;
  fecha_nacimiento?: string; // YYYY-MM-DD
  correo_contacto?: string;
  telefono_contacto?: string;
  estado_civil?: string;
  distrito_residencia?: string;
  seguro_vida_ley?: SeguroVidaLey;
  aficiones?: string;
  experiencia?: string;
  comentarios?: string;
  estado?: EstadoPersonal;
  alergias?: string;
  condicion_medica?: string;
  profesion?: string;
  nro_cta_bancaria?: string;
}

/**
 * A normalized profile record used across the UI.
 * Built from the (loosely-typed) backend response via `normalizePersonal`.
 */
export interface Personal extends PersonalInput {
  DNI: string;
  rol: RolPersonal | string | null;
  cv: string | null;
  foto_perfil: string | null;
}

/**
 * Permissive shape of a raw profile returned by the backend. The
 * `/perfiles/personal` endpoint formats fields "by rol", and casing has been
 * observed to vary, so we keep this loose and normalize before use.
 */
export interface PersonalRaw {
  DNI?: string | number;
  dni?: string | number;
  Nombre?: string;
  nombre?: string;
  Apellido?: string;
  apellido?: string;
  apellidos?: string;
  Genero?: string;
  genero?: string;
  RUC?: string;
  ruc?: string;
  fecha_nacimiento?: string;
  correo_contacto?: string;
  correo?: string;
  telefono_contacto?: string;
  telefono?: string;
  estado_civil?: string;
  distrito_residencia?: string;
  seguro_vida_ley?: string;
  aficiones?: string;
  experiencia?: string;
  comentarios?: string;
  estado?: string;
  alergias?: string;
  condicion_medica?: string;
  profesion?: string;
  nro_cta_bancaria?: string;
  rol?: string;
  Rol?: string;
  cv?: string | null;
  foto_perfil?: string | null;
  [key: string]: unknown;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/** Query params accepted by `GET /api/perfiles/personal`. */
export interface ListPersonalParams {
  nombre?: string;
  apellido?: string;
  rol?: RolPersonal;
  page?: number;
  limit?: number;
}

// ---- Sub-resources (Documentos tab) ----

/** `GET/POST /api/perfiles/{dni}/certificaciones` */
export interface Certificacion {
  id: number;
  nombre: string;
  institucion: string;
  fecha_validez: string | null; // YYYY-MM-DD
  foto: string | null;
}

export interface CertificacionRaw {
  id?: number | string;
  id_certificacion?: number | string;
  nombre?: string;
  institucion?: string;
  fecha_validez?: string | null;
  foto?: string | null;
  [key: string]: unknown;
}

export interface CreateCertificacionBody {
  nombre: string;
  institucion: string;
  fecha_validez?: string;
}
