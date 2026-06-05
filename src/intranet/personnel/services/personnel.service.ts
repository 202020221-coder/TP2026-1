import axios from "@/shared/api/axios.config";
import type {
  Personal,
  PersonalRaw,
  PersonalInput,
  PaginatedResponse,
  PaginationMeta,
  ListPersonalParams,
  EstadoPersonal,
  SeguroVidaLey,
  Certificacion,
  CertificacionRaw,
  CreateCertificacionBody,
} from "../types";

const str = (v: unknown): string => (v == null ? "" : String(v));

const ESTADOS: EstadoPersonal[] = ["inhabilitado", "en trabajo", "disponible"];
const normEstado = (v: unknown): EstadoPersonal | undefined => {
  const s = str(v).toLowerCase().trim();
  return ESTADOS.find((e) => e === s);
};

const normSeguro = (v: unknown): SeguroVidaLey | undefined => {
  const s = str(v).toLowerCase().trim();
  return s === "si" || s === "no" ? s : undefined;
};

const dateOnly = (v: unknown): string | undefined => {
  const s = str(v);
  return s ? s.slice(0, 10) : undefined;
};

/** Convert a permissive backend profile into the normalized `Personal` shape. */
export const normalizePersonal = (raw: PersonalRaw): Personal => ({
  DNI: str(raw.DNI ?? raw.dni),
  Nombre: str(raw.Nombre ?? raw.nombre),
  Apellido: str(raw.Apellido ?? raw.apellido ?? raw.apellidos),
  Genero: str(raw.Genero ?? raw.genero) || undefined,
  RUC: str(raw.RUC ?? raw.ruc) || undefined,
  fecha_nacimiento: dateOnly(raw.fecha_nacimiento),
  correo_contacto: str(raw.correo_contacto ?? raw.correo) || undefined,
  telefono_contacto: str(raw.telefono_contacto ?? raw.telefono) || undefined,
  estado_civil: str(raw.estado_civil) || undefined,
  distrito_residencia: str(raw.distrito_residencia) || undefined,
  seguro_vida_ley: normSeguro(raw.seguro_vida_ley),
  aficiones: str(raw.aficiones) || undefined,
  experiencia: str(raw.experiencia) || undefined,
  comentarios: str(raw.comentarios) || undefined,
  estado: normEstado(raw.estado),
  alergias: str(raw.alergias) || undefined,
  condicion_medica: str(raw.condicion_medica) || undefined,
  profesion: str(raw.profesion) || undefined,
  nro_cta_bancaria: str(raw.nro_cta_bancaria) || undefined,
  rol: str(raw.rol ?? raw.Rol) || null,
  cv: (raw.cv as string | null) ?? null,
  foto_perfil: (raw.foto_perfil as string | null) ?? null,
});

const normalizeCertificacion = (raw: CertificacionRaw): Certificacion => ({
  id: Number(raw.id ?? raw.id_certificacion ?? 0),
  nombre: str(raw.nombre),
  institucion: str(raw.institucion),
  fecha_validez: dateOnly(raw.fecha_validez) ?? null,
  foto: (raw.foto as string | null) ?? null,
});

/** Unwrap either a bare array or a `{ data, pagination }` envelope. */
const unwrapList = <R>(payload: unknown): { rows: R[]; pagination?: PaginationMeta } => {
  if (Array.isArray(payload)) return { rows: payload as R[] };
  const obj = payload as { data?: R[]; pagination?: PaginationMeta } | null;
  return { rows: obj?.data ?? [], pagination: obj?.pagination };
};

/**
 * Drop empty/undefined optional fields so we never overwrite backend data with
 * blanks. `Nombre`/`Apellido` are always kept (required by the endpoint).
 */
const cleanBody = (input: PersonalInput): PersonalInput => {
  const out: Record<string, unknown> = {
    Nombre: input.Nombre,
    Apellido: input.Apellido,
  };
  for (const [k, value] of Object.entries(input)) {
    if (k === "Nombre" || k === "Apellido") continue;
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      out[k] = value;
    }
  }
  return out as unknown as PersonalInput;
};

export const personnelService = {
  /** List personnel (formatted by rol) with pagination + optional filters. */
  list: (params: ListPersonalParams = {}): Promise<PaginatedResponse<Personal>> =>
    axios
      .get<unknown>(`/perfiles/personal`, {
        params: { page: 1, limit: 100, ...params },
      })
      .then((r) => {
        const { rows, pagination } = unwrapList<PersonalRaw>(r.data);
        const data = rows.map(normalizePersonal);
        return {
          data,
          pagination:
            pagination ?? {
              total: data.length,
              page: params.page ?? 1,
              limit: params.limit ?? data.length,
              totalPages: 1,
            },
        };
      }),

  /** Get a single profile by DNI (formatted by rol, with related data). */
  getById: (dni: string): Promise<Personal> =>
    axios
      .get<PersonalRaw>(`/perfiles/personal/${dni}`)
      .then((r) => normalizePersonal(r.data)),

  /** Create a profile. DNI travels in the path. */
  create: (dni: string, body: PersonalInput): Promise<Personal> =>
    axios
      .post<PersonalRaw>(`/perfiles/personal/${dni}`, cleanBody(body))
      .then((r) => normalizePersonal(r.data ?? { DNI: dni, ...body })),

  /** Update an existing profile (full personal format). */
  update: (dni: string, body: Partial<PersonalInput>): Promise<Personal> =>
    axios
      .put<PersonalRaw>(
        `/perfiles/personal/${dni}`,
        cleanBody({ Nombre: "", Apellido: "", ...body } as PersonalInput),
      )
      .then((r) => normalizePersonal(r.data ?? { DNI: dni, ...body })),

  /** Delete a profile. */
  remove: (dni: string): Promise<void> =>
    axios.delete(`/perfiles/${dni}`).then(() => undefined),

  // ---- Photo ----

  /** Upload the profile photo (multipart, field `foto_perfil`). */
  uploadFoto: (dni: string, file: File): Promise<void> => {
    const fd = new FormData();
    fd.append("foto_perfil", file);
    return axios.post(`/perfiles/${dni}/foto`, fd).then(() => undefined);
  },

  /** Fetch the stored photo as an object URL (sends the Bearer token). */
  getFotoUrl: (dni: string): Promise<string> =>
    axios
      .get(`/perfiles/${dni}/foto`, { responseType: "blob" })
      .then((r) => URL.createObjectURL(r.data as Blob)),

  // ---- CV ----

  /** Upload the CV PDF (multipart, field `cv`). */
  uploadCv: (dni: string, file: File): Promise<void> => {
    const fd = new FormData();
    fd.append("cv", file);
    return axios.post(`/perfiles/${dni}/cv`, fd).then(() => undefined);
  },

  /** Fetch the stored CV as an object URL (sends the Bearer token). */
  getCvUrl: (dni: string): Promise<string> =>
    axios
      .get(`/perfiles/${dni}/cv`, { responseType: "blob" })
      .then((r) => URL.createObjectURL(r.data as Blob)),

  // ---- Certificaciones ----

  listCertificaciones: (dni: string): Promise<Certificacion[]> =>
    axios.get<unknown>(`/perfiles/${dni}/certificaciones`).then((r) => {
      const { rows } = unwrapList<CertificacionRaw>(r.data);
      return rows.map(normalizeCertificacion);
    }),

  createCertificacion: (
    dni: string,
    body: CreateCertificacionBody,
  ): Promise<{ id?: number }> =>
    axios
      .post<{ id?: number }>(`/perfiles/${dni}/certificaciones`, body)
      .then((r) => r.data ?? {}),

  /** Upload a certification PDF (multipart, field `pdf_certificacion`). */
  uploadCertificacionPdf: (
    dni: string,
    id: number,
    file: File,
  ): Promise<void> => {
    const fd = new FormData();
    fd.append("pdf_certificacion", file);
    return axios
      .post(`/perfiles/${dni}/certificaciones/${id}/pdf`, fd)
      .then(() => undefined);
  },

  deleteCertificacion: (dni: string, id: number): Promise<void> =>
    axios
      .delete(`/perfiles/${dni}/certificaciones/${id}`)
      .then(() => undefined),
};
