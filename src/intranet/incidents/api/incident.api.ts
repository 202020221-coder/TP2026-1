import axiosInstance from "@/shared/api/axios.config";
import { toSearchParams } from "@/shared/lib/to-search-params";
import type { GetIncidentsQP } from "../interfaces/query-params.dto";
import type {
  GetIncidentsResponse,
  GetIncidentResponse,
  GetIncidentObjectsResponse,
  GetIncidentInvolvedResponse,
  GetIncidentQuotationsResponse,
} from "../interfaces/responses.dto";
import type { Incident } from "../interfaces/incident";
import type {
  InvolvedObject,
  CreateIncidentQuotationBody,
  CreateIncidentQuotationResponse,
  IncidentQuotation,
  IncidentQuotationDestinatariosResponse,
} from "../interfaces/incident-quotation";
import type {
  IncidentInvolved,
  IncidentInvolvedRaw,
} from "../interfaces/incident";

// ── Interfaces para cuerpos de petición ─────────────────────────────────────

export interface CreateIncidentBody {
  id_proyecto: number;
  empresa_involucrada: string;
  cotizacion_remuneracion?: number;
  comentario: string;
  estado?: string;
  nombre_incidencia?: string | null;
}

export interface UpdateIncidentBody {
  id: number;
  empresa_involucrada?: string;
  cotizacion_remuneracion?: number;
  comentario?: string;
  estado?: string;
  nombre_incidencia?:string|null
}

export interface CreateIncidentObjectBody {
  categoria: "Objetos" | "Camiones";
  objeto: string;
  fecha_perdida?: string | null;
  cantidad_involucrada: number;
  cantidad_enviada: number;
  ocurrencia: string;
  ultima_ubicacion: string;
  precio_remunerar?: number | null;
  // Compatibilidad con backend legacy de incidencias/objetos.
  cantidad?: number;
  comentario?: string;
  tipo?: "Objetos" | "Camiones";
  descripcion?: string;
  ocurrencia_inventario?: string | null;
  ocurrencia_camion?: string | null;
}

/** Body para `POST /incidencias/{id}/involucrados`. */
export interface CreateIncidentInvolvedBody {
  dni_involucrado: string;
  descargo: string;
  comentario: string;
  nombre: string;
  Perfil_Registrado: boolean;
  cargo: string;
}

/** Body para `PUT /incidencias/{id}/involucrados/{ivid}`. */
export type UpdateIncidentInvolvedBody = CreateIncidentInvolvedBody;

type IncidentObjectRaw = Partial<{
  id: number;
  oid: number;
  id_incidencia: number;
  idIncidencia: number;
  id_proyecto_inventario: number | null;
  id_proyecto_camion: number | null;
  categoria: string;
  tipo: string;
  objeto: string;
  descripcion: string;
  fecha_perdida: string | null;
  fechaPerdida: string | null;
  cantidad_involucrada: number;
  cantidadInvolucrada: number;
  cantidad_enviada: number;
  cantidadEnviada: number;
  cantidad: number;
  ocurrencia_inventario: string | null;
  ocurrencia_camion: string | null;
  ocurrencia: string;
  ultima_ubicacion: string;
  ultimaUbicacion: string;
  comentario: string;
  precio_remunerar: number | null;
  precioRemunerar: number | null;
}>;

const extractIncidentObjectsArray = (payload: unknown): IncidentObjectRaw[] => {
  if (Array.isArray(payload)) {
    return payload as IncidentObjectRaw[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) {
      return record.data as IncidentObjectRaw[];
    }
  }

  return [];
};

const toInvolvedObject = (raw: IncidentObjectRaw): InvolvedObject => {
  const hasTruckSignals =
    (raw.id_proyecto_camion !== null && raw.id_proyecto_camion !== undefined) ||
    (raw.ocurrencia_camion !== null && raw.ocurrencia_camion !== undefined) ||
    String(raw.categoria ?? "")
      .toLowerCase()
      .includes("camion") ||
    String(raw.tipo ?? "")
      .toLowerCase()
      .includes("camion");

  const categoria = hasTruckSignals ? "Camiones" : "Objetos";

  const occurrence =
    raw.ocurrencia ?? raw.ocurrencia_inventario ?? raw.ocurrencia_camion ?? "";

  const quantity =
    raw.cantidad_involucrada ?? raw.cantidad ?? raw.cantidadEnviada ?? 0;

  const objectLabel =
    raw.objeto ??
    raw.descripcion ??
    raw.comentario ??
    (categoria === "Camiones"
      ? `Camion #${raw.id_proyecto_camion ?? "-"}`
      : `Objeto #${raw.id_proyecto_inventario ?? "-"}`);

  const remunerationRaw = raw.precio_remunerar ?? raw.precioRemunerar ?? null;
  const remuneration =
    remunerationRaw === null || remunerationRaw === undefined
      ? null
      : Number(remunerationRaw);

  return {
    id: Number(raw.id ?? raw.oid ?? 0),
    id_incidencia: Number(raw.id_incidencia ?? raw.idIncidencia ?? 0),
    categoria,
    objeto: String(objectLabel),
    fecha_perdida: (raw.fecha_perdida ?? raw.fechaPerdida ?? null) as
      | string
      | null,
    cantidad_involucrada: Number(quantity),
    cantidad_enviada: Number(
      raw.cantidad_enviada ?? raw.cantidadEnviada ?? raw.cantidad ?? quantity,
    ),
    ocurrencia: String(occurrence),
    ultima_ubicacion: String(raw.ultima_ubicacion ?? raw.ultimaUbicacion ?? ""),
    precio_remunerar: Number.isFinite(remuneration) ? remuneration : null,
  };
};

// ── Incidencias ──────────────────────────────────────────────────────────────

// Forma cruda del endpoint /incidencias/proyecto/{id} (no incluye paginación).
interface ProjectIncidentsRaw {
  id_Proyecto?: number;
  Proyecto_Nombre?: string;
  total?: number;
  data?: Incident[];
}

/**
 * Normaliza la respuesta del endpoint por proyecto a la forma paginada estándar,
 * aplicando búsqueda / estado / paginación del lado del cliente, ya que ese
 * endpoint no soporta esos parámetros.
 */
function buildIncidentsByProjectResponse(
  raw: ProjectIncidentsRaw,
  params: GetIncidentsQP,
): GetIncidentsResponse {
  const all = Array.isArray(raw.data) ? raw.data : [];

  const search = params.buscar?.trim().toLowerCase();
  const filtered = all.filter((inc) => {
    const matchesEstado = !params.estado || inc.estado === params.estado;
    const matchesSearch =
      !search ||
      inc.comentario?.toLowerCase().includes(search) ||
      inc.Cliente_Nombre?.toLowerCase().includes(search);
    return matchesEstado && matchesSearch;
  });

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    data: filtered.slice(start, start + limit),
    pagination: { total, page, limit, totalPages },
  };
}

/** Listar todas las incidencias */
export async function getAllIncidents(params: GetIncidentsQP) {
  // El endpoint global /incidencias?id_proyecto= NO filtra por proyecto en el
  // backend (devuelve todas las incidencias). Para una vista por proyecto usamos
  // el endpoint dedicado que sí filtra, normalizando su respuesta.
  if (params.id_proyecto != null) {
    const response = await axiosInstance.get<ProjectIncidentsRaw>(
      `/incidencias/proyecto/${params.id_proyecto}`,
    );
    return buildIncidentsByProjectResponse(response.data, params);
  }

  const response = await axiosInstance.get<GetIncidentsResponse>(
    `/incidencias?${toSearchParams(params)}`,
  );
  return response.data;
}

/** Obtener incidencia por ID */
export async function getIncidentById(id: number) {
  const response = await axiosInstance.get<GetIncidentResponse>(
    `/incidencias/${id}`,
  );
  return response.data;
}

/** Obtener incidencias por ID de proyecto */
export async function getIncidentsByProject(id_proyecto: number) {
  const response = await axiosInstance.get<GetIncidentsResponse>(
    `/incidencias/proyecto/${id_proyecto}`,
  );
  return response.data;
}

/** Crear incidencia */
export async function createIncident(body: CreateIncidentBody): Promise<void> {
  await axiosInstance.post(`/incidencias`, body);
}

/** Actualizar incidencia */
export async function updateIncident(body: UpdateIncidentBody): Promise<void> {
  const { id, ...rest } = body;
  await axiosInstance.put(`/incidencias/${id}`, rest);
}

/** Eliminar incidencia */
export async function deleteIncident(id: number): Promise<void> {
  await axiosInstance.delete(`/incidencias/${id}`);
}

// ── Objetos de incidencia ────────────────────────────────────────────────────

/** Listar objetos y camiones de la incidencia */
export async function getIncidentObjects(id: number) {
  const response = await axiosInstance.get<unknown>(
    `/incidencias/${id}/objetos`,
  );

  const objects = extractIncidentObjectsArray(response.data)
    .map(toInvolvedObject)
    .filter((item) => item.id > 0);

  return objects as GetIncidentObjectsResponse;
}

/** Agregar objeto/camión a incidencia */
export async function addIncidentObject(
  id: number,
  body: CreateIncidentObjectBody,
): Promise<void> {
  await axiosInstance.post(`/incidencias/${id}/objetos`, body);
}

/** Actualizar objeto/camión de incidencia */
export async function updateIncidentObject(
  id: number,
  oid: number,
  body: CreateIncidentObjectBody,
): Promise<void> {
  try {
    await axiosInstance.put(`/incidencias/${id}/objetos/${oid}`, body);
    return;
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;

    // En algunos entornos el backend no expone PUT para objetos de incidencia.
    // Fallback: borrar y volver a registrar con POST.
    if (status === 404 || status === 405) {
      await axiosInstance.delete(`/incidencias/${id}/objetos/${oid}`);
      await axiosInstance.post(`/incidencias/${id}/objetos`, body);
      return;
    }

    throw error;
  }
}

/** Eliminar objeto de incidencia */
export async function deleteIncidentObject(
  id: number,
  oid: number,
): Promise<void> {
  await axiosInstance.delete(`/incidencias/${id}/objetos/${oid}`);
}

const extractIncidentInvolvedArray = (
  payload: unknown,
): IncidentInvolvedRaw[] => {
  if (Array.isArray(payload)) {
    return payload as IncidentInvolvedRaw[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) {
      return record.data as IncidentInvolvedRaw[];
    }
  }

  return [];
};

const buildInvolvedName = (raw: IncidentInvolvedRaw): string => {
  const fromProfile = raw.nombre?.trim();
  if (fromProfile) {
    return fromProfile;
  }

  const fullName =
    `${raw.Involucrado_Nombre ?? ""} ${raw.Involucrado_Apellido ?? ""}`.trim();
  return fullName;
};

const parsePerfilRegistrado = (
  value: IncidentInvolvedRaw["Perfil_Registrado"],
): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "true" ||
      normalized === "si" ||
      normalized === "sí" ||
      normalized === "1"
    );
  }

  return false;
};

const toIncidentInvolved = (raw: IncidentInvolvedRaw): IncidentInvolved => {
  const perfilRegistrado = parsePerfilRegistrado(raw.Perfil_Registrado);

  return {
    id: Number(raw.id),
    id_incidencia: Number(raw.id_incidencia),
    id_trabajo: raw.id_trabajo ?? null,
    dni: raw.dni_involucrado?.trim() || null,
    nombre: buildInvolvedName(raw),
    cargo: raw.cargo?.trim() || null,
    descargo_persona: raw.descargo?.trim() ?? "",
    comentario_empresa: raw.comentario?.trim() ?? "",
    trabajo_comentario: raw.Trabajo_Comentario?.trim() ?? "",
    tiene_relacion_empresa: perfilRegistrado,
    perfil_registrado: null,
  };
};

// ── Involucrados de incidencia ────────────────────────────────────────────────

/** Listar involucrados de la incidencia */
export async function getIncidentInvolved(id: number) {
  const response = await axiosInstance.get<unknown>(
    `/incidencias/${id}/involucrados`,
  );

  const involved = extractIncidentInvolvedArray(response.data)
    .map(toIncidentInvolved)
    .filter((item) => item.id > 0);

  return involved as GetIncidentInvolvedResponse;
}

/** Crear involucrado — `POST /incidencias/{id}/involucrados`. */
export async function addIncidentInvolved(
  id: number,
  body: CreateIncidentInvolvedBody,
): Promise<void> {
  await axiosInstance.post(`/incidencias/${id}/involucrados`, body);
}

/** Actualizar involucrado — `PUT /incidencias/{id}/involucrados/{ivid}`. */
export async function updateIncidentInvolved(
  id: number,
  ivid: number,
  body: UpdateIncidentInvolvedBody,
): Promise<void> {
  await axiosInstance.put(`/incidencias/${id}/involucrados/${ivid}`, body);
}

/** Eliminar involucrado — `DELETE /incidencias/{id}/involucrados/{ivid}`. */
export async function deleteIncidentInvolved(
  id: number,
  ivid: number,
): Promise<void> {
  await axiosInstance.delete(`/incidencias/${id}/involucrados/${ivid}`);
}

// ── Cotizaciones de incidencia ────────────────────────────────────────────────

const extractCreatedQuotationId = (raw: unknown): number => {
  if (!raw || typeof raw !== "object") return 0;

  const record = raw as Record<string, unknown>;

  if (record.data && typeof record.data === "object") {
    const nested = extractCreatedQuotationId(record.data);
    if (nested > 0) return nested;
  }

  if (record.cotizacion && typeof record.cotizacion === "object") {
    const nested = extractCreatedQuotationId(record.cotizacion);
    if (nested > 0) return nested;
  }

  const candidates = [
    record.id,
    record.ID,
    record.id_cotizacion,
    record.ID_Cotizacion,
    record.idCotizacion,
  ];

  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isInteger(parsed) && parsed > 0) return parsed;
  }

  return 0;
};

const normalizeIncidentQuotation = (
  raw: Record<string, unknown>,
): IncidentQuotation => ({
  id: extractCreatedQuotationId(raw),
  id_incidencia:
    raw.id_incidencia != null ? Number(raw.id_incidencia) : undefined,
  nombre: String(raw.nombre ?? ""),
  version: Number(raw.version ?? 1),
  desactualizado:
    raw.desactualizado != null ? String(raw.desactualizado) : undefined,
  estado: String(raw.estado ?? "Pendiente") as IncidentQuotation["estado"],
  precioTotal: (raw.precioTotal ??
    raw.precio_total ??
    raw.precio_subtotal ??
    null) as string | number | null | undefined,

  precio_subtotal:
    raw.precio_subtotal != null ? Number(raw.precio_subtotal) : null,
  nombreCliente:
    raw.nombreCliente != null
      ? String(raw.nombreCliente)
      : raw.nombre_cliente != null
        ? String(raw.nombre_cliente)
        : null,
  destinatario: raw.destinatario != null ? String(raw.destinatario) : null,
  fecha_emision:
    raw.fecha_emision != null
      ? String(raw.fecha_emision)
      : raw.fechaEmision != null
        ? String(raw.fechaEmision)
        : null,
  fecha_envio:
    raw.fecha_envio != null
      ? String(raw.fecha_envio)
      : raw.fechaEnvio != null
        ? String(raw.fechaEnvio)
        : null,
  esCotizacionIncidencia: Boolean(
    raw.esCotizacionIncidencia ?? raw.id_incidencia ?? raw.Id_incidencia,
  ),
  mensajes: raw.mensajes != null ? Number(raw.mensajes) : undefined,
  mensajes_pendientes:
    raw.mensajes_pendientes != null
      ? Number(raw.mensajes_pendientes)
      : undefined,
});

const normalizeIncidentQuotationList = (raw: unknown): IncidentQuotation[] => {
  if (Array.isArray(raw)) {
    return raw.map((item) =>
      normalizeIncidentQuotation(item as Record<string, unknown>),
    );
  }
  if (
    raw &&
    typeof raw === "object" &&
    Array.isArray((raw as { data?: unknown[] }).data)
  ) {
    return (raw as { data: Record<string, unknown>[] }).data.map(
      normalizeIncidentQuotation,
    );
  }
  return [];
};

const normalizeCreateIncidentQuotationResponse = (
  raw: unknown,
): CreateIncidentQuotationResponse => {
  const record =
    raw && typeof raw === "object"
      ? (raw as Record<string, unknown> & CreateIncidentQuotationResponse)
      : ({} as CreateIncidentQuotationResponse);

  const id = extractCreatedQuotationId(raw);

  return {
    ...record,
    id,
    version: Number(record.version ?? 1),
    nombre: String(record.nombre ?? ""),
    DNI_O_RUC: String(record.DNI_O_RUC ?? ""),
    precio_total: record.precio_total ?? 0,
    presupuesto_autorrellenado: Array.isArray(record.presupuesto_autorrellenado)
      ? record.presupuesto_autorrellenado
      : undefined,
    servicios: Array.isArray(record.servicios) ? record.servicios : undefined,
  };
};

/** Destinatarios posibles — `GET /incidencias/{id}/cotizaciones/destinatarios`. */
export async function getIncidentQuotationDestinatarios(
  id: number,
): Promise<IncidentQuotationDestinatariosResponse> {
  const response =
    await axiosInstance.get<IncidentQuotationDestinatariosResponse>(
      `/incidencias/${id}/cotizaciones/destinatarios`,
    );
  return {
    incidencia: response.data.incidencia ?? {},
    opciones: Array.isArray(response.data.opciones)
      ? response.data.opciones
      : [],
  };
}

/** Listar cotizaciones de una incidencia — `GET /incidencias/{id}/cotizaciones`. */
export async function getIncidentQuotations(
  id: number,
): Promise<GetIncidentQuotationsResponse> {
  const response = await axiosInstance.get<unknown>(
    `/incidencias/${id}/cotizaciones`,
  );
  return normalizeIncidentQuotationList(response.data);
}

/** Crear cotización de incidencia — `POST /incidencias/{id}/cotizaciones`. */
export async function createIncidentQuotation(
  id: number,
  body: CreateIncidentQuotationBody,
): Promise<CreateIncidentQuotationResponse> {
  const response = await axiosInstance.post<unknown>(
    `/incidencias/${id}/cotizaciones`,
    body,
  );
  return normalizeCreateIncidentQuotationResponse(response.data);
}
