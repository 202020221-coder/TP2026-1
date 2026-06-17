import axiosInstance from "@/shared/api/axios.config";
import type { GetServiciosQP } from "../interfaces/query-params.dto";
import type { GetServiciosResponse } from "../interfaces/responses.dto";
import type {
  Servicio,
  CreateServicioDTO,
  UpdateServicioDTO,
  PersonalRequerido,
  CreatePersonalRequeridoDTO,
  UpdatePersonalRequeridoDTO,
  ServicioFase,
  ServicioSubservicio,
  ServicioEtapaPayload,
  ServicioEtapaActividadPayload,
  ServicioSubservicioPayload,
} from "../interfaces/service";

// Ruta del endpoint PÚBLICO de servicios para la landing (sin autenticación).
// Cámbiala por la que definas en el backend (p. ej. "/servicios/publicos").
export const PUBLIC_SERVICIOS_PATH = "/servicios/publicos";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos del backend (snake_case con ID_Servicio como PK)
// ─────────────────────────────────────────────────────────────────────────────
interface ServicioRaw {
  ID_Servicio?: number;
  id?: number; // por si el backend normaliza a lowercase
  nombre: string;
  descripcion: string;
  precio_regular: number;
  condicional_precio: string;
  observaciones: string;
  foto?: string | null;
  foto_url?: string | null;
  imagen?: string | null;
  url_imagen?: string | null;
  Estado?: "Activo" | "Desactivado"; // campo real del backend
  activo?: boolean;                   // por compatibilidad defensiva
  pago_por_dia?: boolean;             // pago por día del servicio
  fases?: unknown;                    // fases embebidas (si el backend las incluye)
  faces?: unknown;                    // tolerar typo común del backend
  subservicios?: unknown;             // subservicios embebidos (si el backend los incluye)
  sub_servicios?: unknown;            // tolerar snake_case alternativo
}

// ─────────────────────────────────────────────────────────────────────────────
// FASES (mismo esquema que cotizaciones). El backend puede devolverlas embebidas
// en el servicio o vía endpoint dedicado /servicios/:id/fases.
// ─────────────────────────────────────────────────────────────────────────────
interface FaseRaw {
  id?: string | number;
  ID_Fase?: string | number;
  nombre?: string;
  name?: string;
  descripcion?: string;
  description?: string;
  duracion?: number | string;
  duration?: number | string;
  actividades?: unknown;
  activities?: unknown;
}

interface ActividadRaw {
  id?: string | number;
  ID_Actividad?: string | number;
  nombre?: string;
  name?: string;
}

let faseSeq = 0;
const genFaseId = (prefix: string) => `${prefix}_${Date.now()}_${faseSeq++}`;

const toActividad = (raw: ActividadRaw) => ({
  id: String(raw.id ?? raw.ID_Actividad ?? genFaseId("act")),
  name: raw.name ?? raw.nombre ?? "",
});

const toFase = (raw: FaseRaw): ServicioFase => {
  const actividadesRaw = (raw.activities ?? raw.actividades ?? []) as ActividadRaw[];
  const activities = Array.isArray(actividadesRaw)
    ? actividadesRaw.map(toActividad)
    : [];
  const durationValue = Number(raw.duration ?? raw.duracion ?? 1);
  return {
    id: String(raw.id ?? raw.ID_Fase ?? genFaseId("fase")),
    name: raw.name ?? raw.nombre ?? "",
    description: raw.description ?? raw.descripcion ?? "",
    duration: Number.isFinite(durationValue) && durationValue > 0 ? durationValue : 1,
    activities,
  };
};

const pickFasesFromRaw = (raw: ServicioRaw): ServicioFase[] => {
  const value = raw.fases ?? raw.faces;
  if (!Array.isArray(value)) return [];
  return (value as FaseRaw[]).map(toFase);
};

interface SubservicioRaw {
  id?: number;
  id_subservicio?: number;
  ID_Servicio?: number;
  ID_Subservicio?: number;
  servicio_id?: number;
  nombre?: string;
  name?: string;
  faseIds?: unknown;
  fase_ids?: unknown;
  fases?: unknown;
}

const toSubservicio = (raw: SubservicioRaw): ServicioSubservicio => {
  const fasesValue = raw.faseIds ?? raw.fase_ids ?? raw.fases ?? [];
  const faseIds = Array.isArray(fasesValue)
    ? fasesValue.map((f) =>
        typeof f === "object" && f !== null
          ? String((f as { id?: unknown }).id ?? "")
          : String(f),
      ).filter((id) => id.length > 0)
    : [];
  return {
    id: Number(
      raw.id ??
        raw.id_subservicio ??
        raw.ID_Subservicio ??
        raw.ID_Servicio ??
        raw.servicio_id ??
        0,
    ),
    nombre: raw.nombre ?? raw.name ?? "",
    faseIds,
  };
};

const pickSubserviciosFromRaw = (raw: ServicioRaw): ServicioSubservicio[] => {
  const value = raw.subservicios ?? raw.sub_servicios;
  if (!Array.isArray(value)) return [];
  return (value as SubservicioRaw[]).map(toSubservicio);
};

const pickFotoFromRaw = (raw: ServicioRaw): string | null => {
  const value = raw.foto ?? raw.foto_url ?? raw.imagen ?? raw.url_imagen ?? null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

// Extrae el objeto ServicioRaw de cualquier forma que devuelva el backend:
// - directamente: { ID_Servicio, nombre, ... }
// - envuelto en data: { data: { ID_Servicio, nombre, ... } }
// - envuelto en data array: { data: [{ ID_Servicio, nombre, ... }] }  (raro pero defensivo)
const extractRaw = (response: unknown): ServicioRaw => {
  if (!response || typeof response !== "object") {
    throw new Error("Respuesta vacía del servidor");
  }
  const r = response as Record<string, unknown>;

  // Caso: { data: { ... } }
  if (r.data && typeof r.data === "object" && !Array.isArray(r.data)) {
    return r.data as ServicioRaw;
  }
  // Caso: { data: [{ ... }] } — tomar el primero
  if (r.data && Array.isArray(r.data) && r.data.length > 0) {
    return r.data[0] as ServicioRaw;
  }
  // Caso: el objeto directo tiene ID_Servicio o id
  if (r.ID_Servicio !== undefined || r.id !== undefined) {
    return r as unknown as ServicioRaw;
  }
  // Último recurso: devolver lo que sea y dejar que toServicio maneje
  return r as unknown as ServicioRaw;
};

const toServicio = (raw: ServicioRaw): Servicio => ({
  id: raw.ID_Servicio ?? raw.id ?? 0,
  nombre: raw.nombre ?? "",
  descripcion: raw.descripcion ?? "",
  precio_regular: Number(raw.precio_regular ?? 0),
  condicional_precio: raw.condicional_precio ?? "",
  observaciones: raw.observaciones ?? "",
  foto: pickFotoFromRaw(raw),
  activo: raw.Estado ? raw.Estado === "Activo" : (raw.activo ?? true),
  pago_por_dia: raw.pago_por_dia === true,
  fases: pickFasesFromRaw(raw),
  subservicios: pickSubserviciosFromRaw(raw),
});

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIOS
// ─────────────────────────────────────────────────────────────────────────────
export const getServicios = async (
  params: GetServiciosQP,
): Promise<GetServiciosResponse> => {
  const { page, limit = 10, search } = params;
  const response = await axiosInstance.get<{
    data: ServicioRaw[];
    pagination: GetServiciosResponse["pagination"];
  }>("/servicios", {
    params: { page, limit, ...(search ? { search } : {}) },
  });

  return {
    data: response.data.data.map(toServicio),
    pagination: response.data.pagination,
  };
};

/**
 * Servicios para la landing pública (sin token).
 * Cuando crees el endpoint público en el backend, ajusta la ruta aquí.
 * Acepta tanto un array directo como { data: [...] } o { data: [...], pagination }.
 */
export const getServiciosPublicos = async (): Promise<Servicio[]> => {
  const response = await axiosInstance.get(PUBLIC_SERVICIOS_PATH);
  const raw = response.data;
  const arr: ServicioRaw[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : [];
  return arr.map(toServicio);
};

/** Catálogo de servicios permitidos en cotizaciones de incidencia. */
export const getIncidentServiceCatalog = async (): Promise<Servicio[]> => {
  const response = await axiosInstance.get<unknown>(
    "/servicios/incidencia/catalogo",
  );
  const raw = response.data;
  const arr: ServicioRaw[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { data?: unknown[] })?.data)
      ? ((raw as { data: ServicioRaw[] }).data ?? [])
      : [];
  return arr.map(toServicio);
};

export const createServicio = async (dto: CreateServicioDTO): Promise<Servicio> => {
  const response = await axiosInstance.post("/servicios", dto);
  const raw = extractRaw(response.data);
  return toServicio(raw);
};

export const updateServicio = async (
  id: number,
  dto: UpdateServicioDTO,
): Promise<Servicio> => {
  const response = await axiosInstance.put(`/servicios/${id}`, dto);
  const raw = extractRaw(response.data);
  // Si el backend no devuelve el objeto actualizado, reconstruirlo con los datos enviados
  if (!raw.ID_Servicio && !raw.id) {
    return {
      id,
      nombre: dto.nombre ?? "",
      descripcion: dto.descripcion ?? "",
      precio_regular: dto.precio_regular ?? 0,
      condicional_precio: dto.condicional_precio ?? "",
      observaciones: dto.observaciones ?? "",
      foto: null,
      activo: dto.activo ?? true,
      fases: [],
      subservicios: [],
    };
  }
  return toServicio(raw);
};

/** Ruta relativa: POST {VITE_API_URL}/servicios/:id/foto (ej. …/api/servicios/12/foto). */
export const servicioFotoUploadPath = (id: number) => `/servicios/${id}/foto`;

/** Sube o reemplaza la foto de un servicio (multipart, campo `foto`). */
export const uploadServicioFoto = async (
  id: number,
  file: File,
): Promise<Servicio> => {
  const formData = new FormData();
  formData.append("foto", file);
  // No fijar Content-Type: axios añade el boundary del multipart automáticamente.
  const response = await axiosInstance.post(servicioFotoUploadPath(id), formData, {
    timeout: 60_000,
  });
  const raw = extractRaw(response.data);
  if (!raw.ID_Servicio && !raw.id) {
    return { id, nombre: "", descripcion: "", precio_regular: 0, condicional_precio: "", observaciones: "", foto: null, activo: true, pago_por_dia: false, fases: [], subservicios: [] };
  }
  return toServicio(raw);
};

export const toggleServicioActivo = async (id: number, currentActivo: boolean): Promise<Servicio> => {
  const nuevoEstado = currentActivo ? "Desactivado" : "Activo";
  const response = await axiosInstance.put(`/servicios/${id}`, { Estado: nuevoEstado });
  const raw = extractRaw(response.data);
  // Si el backend no devuelve el objeto actualizado, construirlo manualmente
  if (!raw.ID_Servicio && !raw.id) {
    return { id, nombre: "", descripcion: "", precio_regular: 0, condicional_precio: "", observaciones: "", foto: null, activo: !currentActivo, pago_por_dia: false, fases: [], subservicios: [] };
  }
  return toServicio(raw);
};

// ─────────────────────────────────────────────────────────────────────────────
// FASES DEL SERVICIO
// ─────────────────────────────────────────────────────────────────────────────

// Un id numérico (p. ej. "1") corresponde a una etapa/actividad ya existente en
// el backend; un id generado en el front (p. ej. "fase_123_0") es nuevo.
const isNumericId = (id: string | number): boolean => /^\d+$/.test(String(id));

/**
 * Serializa las fases del front al formato `etapas` que espera el servicio.
 * Las etapas/actividades existentes conservan su `id`; las nuevas lo omiten.
 */
export const serializeEtapas = (
  fases: ServicioFase[],
): ServicioEtapaPayload[] =>
  fases.map((fase, i) => {
    const etapa: ServicioEtapaPayload = {
      nombre: fase.name,
      descripcion: fase.description,
      duracion: fase.duration,
      orden: i + 1,
      actividades: fase.activities.map((a, j) => {
        const act: ServicioEtapaActividadPayload = {
          nombre: a.name,
          orden: j + 1,
        };
        if (isNumericId(a.id)) act.id = Number(a.id);
        return act;
      }),
    };
    if (isNumericId(fase.id)) etapa.id = Number(fase.id);
    return etapa;
  });

/**
 * Serializa los subservicios del front al formato `subservicios`. Genera una
 * entrada por cada (subservicio, etapa). Si la etapa ya existe usa
 * `id_servicio_etapa`; si es nueva usa `orden_etapa`.
 */
export const serializeSubservicios = (
  subservicios: ServicioSubservicio[],
  fases: ServicioFase[],
): ServicioSubservicioPayload[] => {
  const faseInfo = new Map<string, { etapaId?: number; orden: number }>();
  fases.forEach((fase, i) => {
    faseInfo.set(fase.id, {
      etapaId: isNumericId(fase.id) ? Number(fase.id) : undefined,
      orden: i + 1,
    });
  });

  const result: ServicioSubservicioPayload[] = [];
  for (const sub of subservicios) {
    if (sub.faseIds.length === 0) {
      result.push({ ID_Servicio_subservicio: sub.id });
      continue;
    }
    for (const faseId of sub.faseIds) {
      const info = faseInfo.get(faseId);
      if (!info) continue;
      const entry: ServicioSubservicioPayload = {
        ID_Servicio_subservicio: sub.id,
      };
      if (info.etapaId != null) entry.id_servicio_etapa = info.etapaId;
      else entry.orden_etapa = info.orden;
      result.push(entry);
    }
  }
  return result;
};

// ─────────────────────────────────────────────────────────────────────────────
// PLANTILLA DEL SERVICIO PRINCIPAL
// GET /servicios/:id/principal — devuelve la cabecera del servicio principal,
// sus etapas (fases) con actividades y la matriz de subservicios recomendados.
// Es la fuente real de las fases/subservicios definidos en "Gestionar Servicios".
// ─────────────────────────────────────────────────────────────────────────────
interface PrincipalEtapaRaw {
  id?: string | number;
  nombre?: string;
  name?: string;
  descripcion?: string;
  description?: string;
  duracion?: number | string;
  duration?: number | string;
  orden?: number;
  actividades?: unknown;
  activities?: unknown;
}

interface PrincipalUbicacionEtapaRaw {
  id?: string | number;
  nombre?: string;
  orden?: number;
}

interface PrincipalSubservicioRaw {
  id_subservicio?: number;
  ID_Servicio?: number;
  nombre?: string;
  name?: string;
  Principal?: boolean;
  pago_por_dia?: boolean;
  ubicacion_etapa?: PrincipalUbicacionEtapaRaw | null;
}

export interface ServicioPrincipalTemplate {
  fases: ServicioFase[];
  subservicios: ServicioSubservicio[];
  /** Si true, el servicio principal se paga por día (precio × días totales). */
  principalPagoPorDia: boolean;
}

const mapPrincipalEtapas = (rows: PrincipalEtapaRaw[]): ServicioFase[] => {
  const sorted = [...rows].sort(
    (a, b) => Number(a.orden ?? 0) - Number(b.orden ?? 0),
  );
  return sorted.map((e) => toFase(e as FaseRaw));
};

// La matriz puede traer una fila por (subservicio, etapa). Se agrupa por el
// servicio referenciado (ID_Servicio) y se acumulan las fases en las que
// interviene, alineado con el modelo del front (faseIds: string[]).
const mapPrincipalSubservicios = (
  rows: PrincipalSubservicioRaw[],
): ServicioSubservicio[] => {
  const byService = new Map<number, ServicioSubservicio>();
  for (const row of rows) {
    const servId = Number(row.ID_Servicio ?? row.id_subservicio ?? 0);
    if (!servId) continue;
    const faseId =
      row.ubicacion_etapa?.id != null ? String(row.ubicacion_etapa.id) : null;
    const existing = byService.get(servId);
    if (existing) {
      if (faseId && !existing.faseIds.includes(faseId)) {
        existing.faseIds.push(faseId);
      }
      if (row.pago_por_dia === true) existing.pagoPorDia = true;
    } else {
      byService.set(servId, {
        id: servId,
        nombre: row.nombre ?? row.name ?? "",
        faseIds: faseId ? [faseId] : [],
        pagoPorDia: row.pago_por_dia === true,
      });
    }
  }
  return Array.from(byService.values());
};

/**
 * Obtiene la plantilla del servicio como principal: sus fases (etapas con
 * actividades) y los subservicios recomendados. Endpoint público (sin token).
 * Degrada de forma segura a vacío si el endpoint falla.
 */
export const getServicioPrincipal = async (
  servicioId: number,
): Promise<ServicioPrincipalTemplate> => {
  try {
    const response = await axiosInstance.get(
      `/servicios/${servicioId}/principal`,
    );
    const body = (response.data ?? {}) as Record<string, unknown>;
    const data = (
      body.data && typeof body.data === "object" ? body.data : body
    ) as Record<string, unknown>;

    const principalCandidate = data.servicio_principal;
    const principal = (
      principalCandidate && typeof principalCandidate === "object"
        ? principalCandidate
        : data
    ) as Record<string, unknown>;

    const etapasValue =
      principal.etapas ?? principal.fases ?? data.etapas ?? data.fases ?? [];
    const subsValue =
      data.servicios_secundarios ??
      principal.servicios_secundarios ??
      data.subservicios ??
      [];

    return {
      fases: Array.isArray(etapasValue)
        ? mapPrincipalEtapas(etapasValue as PrincipalEtapaRaw[])
        : [],
      subservicios: Array.isArray(subsValue)
        ? mapPrincipalSubservicios(subsValue as PrincipalSubservicioRaw[])
        : [],
      principalPagoPorDia: principal.pago_por_dia === true,
    };
  } catch {
    return { fases: [], subservicios: [], principalPagoPorDia: false };
  }
};

/**
 * Obtiene las fases de un servicio desde la plantilla del servicio principal.
 * Degrada de forma segura a `[]`.
 */
export const getFasesByServicio = async (
  servicioId: number,
): Promise<ServicioFase[]> => {
  const { fases } = await getServicioPrincipal(servicioId);
  return fases;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBSERVICIOS DEL SERVICIO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene los subservicios de un servicio desde la plantilla del servicio
 * principal. Degrada de forma segura a `[]`.
 */
export const getSubserviciosByServicio = async (
  servicioId: number,
): Promise<ServicioSubservicio[]> => {
  const { subservicios } = await getServicioPrincipal(servicioId);
  return subservicios;
};

// ─────────────────────────────────────────────────────────────────────────────
// PERSONAL REQUERIDO
// ─────────────────────────────────────────────────────────────────────────────

interface PersonalRaw {
  id?: number;
  ID_Personal?: number;
  ID_Servicio?: number;
  profesion?: string;
  cantidad?: number;
  disponibilidad?: string;
  requerimiento_legal?: string;
}

const toPersonal = (raw: PersonalRaw): PersonalRequerido => ({
  id: raw.id ?? raw.ID_Personal ?? 0,
  ID_Servicio: raw.ID_Servicio ?? 0,
  profesion: raw.profesion ?? "",
  cantidad: raw.cantidad ?? 1,
  disponibilidad: raw.disponibilidad ?? "",
  requerimiento_legal: raw.requerimiento_legal ?? "",
});

export const getPersonalByServicio = async (
  servicioId: number,
): Promise<PersonalRequerido[]> => {
  const response = await axiosInstance.get(`/servicios/${servicioId}/personal`);
  const raw = response.data;
  // El backend puede devolver array directo o { data: [...] }
  const arr: PersonalRaw[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  return arr.map(toPersonal);
};

export const createPersonal = async (
  servicioId: number,
  dto: CreatePersonalRequeridoDTO,
): Promise<PersonalRequerido> => {
  const response = await axiosInstance.post(
    `/servicios/${servicioId}/personal`,
    dto,
  );
  const raw = extractRaw(response.data) as PersonalRaw;
  // Si el backend no devuelve el objeto creado, construirlo con un id temporal
  if (!raw.id && !raw.ID_Personal) {
    return {
      id: Date.now(), // id temporal hasta el próximo refetch
      ID_Servicio: servicioId,
      ...dto,
    };
  }
  return toPersonal(raw);
};

export const updatePersonal = async (
  servicioId: number,
  id: number,
  dto: UpdatePersonalRequeridoDTO,
): Promise<PersonalRequerido> => {
  const response = await axiosInstance.put(`/servicios/${servicioId}/personal/${id}`, dto);
  const raw = extractRaw(response.data) as PersonalRaw;
  if (!raw.id && !raw.ID_Personal) {
    return { id, ID_Servicio: servicioId, ...dto } as PersonalRequerido;
  }
  return toPersonal(raw);
};

export const deletePersonal = async (servicioId: number, id: number): Promise<void> => {
  await axiosInstance.delete(`/servicios/${servicioId}/personal/${id}`);
};
