import { addDays, format } from "date-fns";
import { getServicioPrincipal, getServicios } from "@/intranet/services/api/service.api";
import type { Servicio, ServicioSubservicio } from "@/intranet/services/interfaces/service";
import type { GetOrderResponseDTO } from "../interfaces/responses.dto";
import type {
  PostRequestInventoryDTO,
  PostRequestServiceDTO,
} from "../interfaces/create-request.dto";

const DATE_FMT = "yyyy-MM-dd";
const DEFAULT_JORNADA = "08:00 - 17:00";

export interface NormalizedOrderService {
  rowId: number | null;
  ID_Servicio: number;
  nombre: string | null;
  Principal: boolean;
  fecha_inicio_servicio: string;
  fecha_fin_servicio: string;
  horario_servicio: string;
  id_subservicio: number | null;
  ubicacion_etapa: {
    id: number;
    nombre: string;
    orden: number;
  } | null;
}

export type OrderDetailWithServices = GetOrderResponseDTO & {
  servicio_principal?: unknown;
  servicios_secundarios?: unknown;
  etapas?: unknown;
};

const normalizeName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.!]+$/g, "");

export const extractServiceNameFromDescription = (descripcion: string): string => {
  const firstLine = descripcion.split("\n")[0]?.trim() ?? "";
  const match = firstLine.match(/^Solicito el servicio:\s*(.+)$/i);
  return (match?.[1] ?? firstLine).replace(/\.\s*$/, "").trim();
};

const toBooleanPrincipal = (value: unknown): boolean =>
  value === true || value === "YES" || value === "yes";

export const normalizeOrderServiceRow = (
  row: unknown,
): NormalizedOrderService | null => {
  if (!row || typeof row !== "object") return null;
  const raw = row as Record<string, unknown>;
  const idRaw =
    raw.ID_Servicio ?? raw.id_servicio ?? raw.idServicio ?? raw.id;
  const serviceId = Number(idRaw);
  if (!Number.isFinite(serviceId) || serviceId <= 0) return null;

  const ubicacion = raw.ubicacion_etapa;
  const ubicacionEtapa =
    ubicacion && typeof ubicacion === "object"
      ? {
          id: Number((ubicacion as Record<string, unknown>).id) || 0,
          nombre: String(
            (ubicacion as Record<string, unknown>).nombre ?? "",
          ),
          orden: Number((ubicacion as Record<string, unknown>).orden) || 0,
        }
      : null;

  return {
    rowId: Number(raw.id) > 0 ? Number(raw.id) : null,
    ID_Servicio: serviceId,
    nombre:
      typeof raw.nombre === "string"
        ? raw.nombre
        : typeof raw.nombre_servicio === "string"
          ? raw.nombre_servicio
          : null,
    Principal: toBooleanPrincipal(raw.Principal),
    fecha_inicio_servicio: String(raw.fecha_inicio_servicio ?? ""),
    fecha_fin_servicio: String(raw.fecha_fin_servicio ?? ""),
    horario_servicio: String(raw.horario_servicio ?? ""),
    id_subservicio:
      raw.id_subservicio != null
        ? Number(raw.id_subservicio)
        : raw.id_servicio_subservicio != null
          ? Number(raw.id_servicio_subservicio)
          : null,
    ubicacion_etapa:
      ubicacionEtapa && ubicacionEtapa.id > 0 ? ubicacionEtapa : null,
  };
};

/** Servicios de la solicitud leídos exclusivamente de la respuesta del API (BD). */
export const normalizeOrderServices = (
  order: OrderDetailWithServices,
): {
  allServices: NormalizedOrderService[];
  principal: NormalizedOrderService | null;
  secundarios: NormalizedOrderService[];
} => {
  const fromServicios = (order.servicios ?? [])
    .map((row) => normalizeOrderServiceRow(row))
    .filter((row): row is NormalizedOrderService => row != null);

  const principalFromField = normalizeOrderServiceRow(order.servicio_principal);
  const fromSecundarios = (Array.isArray(order.servicios_secundarios)
    ? order.servicios_secundarios
    : []
  )
    .map((row) => normalizeOrderServiceRow(row))
    .filter((row): row is NormalizedOrderService => row != null);

  const mergedById = new Map<number, NormalizedOrderService>();
  for (const service of [...fromServicios, ...fromSecundarios]) {
    if (!mergedById.has(service.ID_Servicio)) {
      mergedById.set(service.ID_Servicio, service);
    }
  }
  if (principalFromField) {
    mergedById.set(principalFromField.ID_Servicio, {
      ...principalFromField,
      Principal: true,
    });
  }

  const merged = Array.from(mergedById.values());
  const principal =
    merged.find((s) => s.Principal) ?? principalFromField ?? null;

  const secundarios = merged.filter(
    (s) => !s.Principal && s.ID_Servicio !== principal?.ID_Servicio,
  );

  const allServices = principal
    ? [principal, ...secundarios]
    : merged;

  return { allServices, principal, secundarios };
};

export async function findCatalogServiceByName(
  name: string,
): Promise<Servicio | null> {
  if (!name.trim()) return null;
  const normalized = normalizeName(name);

  const searched = await getServicios({ page: 1, limit: 20, search: name }).catch(
    () => ({
      data: [] as Servicio[],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }),
  );
  const fromSearch = searched.data.find(
    (service) => normalizeName(service.nombre) === normalized,
  );
  if (fromSearch) return fromSearch;

  for (let page = 1; page <= 5; page++) {
    const batch = await getServicios({ page, limit: 100 }).catch(() => ({
      data: [] as Servicio[],
      pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
    }));
    if (batch.data.length === 0) break;
    const found = batch.data.find(
      (service) => normalizeName(service.nombre) === normalized,
    );
    if (found) return found;
  }

  return null;
}

export async function resolvePrincipalServiceId(
  descripcion: string,
  explicitId: number | null,
): Promise<number | null> {
  if (explicitId != null && explicitId > 0) return explicitId;
  const serviceName = extractServiceNameFromDescription(descripcion);
  const catalog = await findCatalogServiceByName(serviceName);
  return catalog?.id ?? null;
}

/** Fecha local yyyy-MM-dd (sin hora ISO). */
export const toLocalDateString = (date: Date): string => format(date, DATE_FMT);

/** Inicio de servicios en solicitud: día siguiente al de creación. */
export const getSolicitudServiceStartDate = (): string =>
  toLocalDateString(addDays(new Date(), 1));

export type SolicitudServiceSelection = {
  serviceId: number;
  name: string;
  observacionesEleccion?: string;
};

export type SolicitudServiciosPayload = {
  servicio_principal: PostRequestServiceDTO & { Principal: true };
  servicios_secundarios: Array<
    PostRequestServiceDTO & { Principal: false }
  >;
};

const principalDurationDays = (fases: { duration: number }[]): number => {
  const total = fases.reduce(
    (acc, f) => acc + Math.max(0, Number(f.duration) || 0),
    0,
  );
  return total > 0 ? total : 1;
};

const buildUbicacionEtapaPayload = (
  sub: ServicioSubservicio,
  fases: { id: string; name: string; duration: number }[],
) => {
  const faseId = sub.faseIds[0];
  if (!faseId) return undefined;
  const index = fases.findIndex((f) => f.id === faseId);
  const fase = index >= 0 ? fases[index] : null;
  if (!fase) return undefined;
  return {
    id: Number(faseId),
    nombre: fase.name,
    orden: index + 1,
  };
};

export async function buildSolicitudServiciosPayload(
  principalId: number,
  selectedServices: SolicitudServiceSelection[],
): Promise<SolicitudServiciosPayload> {
  const template = await getServicioPrincipal(principalId);
  const templateByServiceId = new Map(
    template.subservicios.map((sub) => [sub.id, sub]),
  );

  const startDate = getSolicitudServiceStartDate();
  const principalDays = principalDurationDays(template.fases);
  const [y, m, d] = startDate.split("-").map(Number);
  const principalEndDate = toLocalDateString(
    addDays(new Date(y, m - 1, d), principalDays),
  );

  const servicios_secundarios: SolicitudServiciosPayload["servicios_secundarios"] =
    [];

  for (const selected of selectedServices) {
    if (selected.serviceId === principalId) continue;
    const templateSub = templateByServiceId.get(selected.serviceId);
    const ubicacion = templateSub
      ? buildUbicacionEtapaPayload(templateSub, template.fases)
      : undefined;

    servicios_secundarios.push({
      ID_Servicio: selected.serviceId,
      Principal: false,
      fecha_inicio_servicio: startDate,
      fecha_fin_servicio: null,
      horario_servicio: DEFAULT_JORNADA,
      ...(templateSub?.id_subservicio != null
        ? { id_subservicio: templateSub.id_subservicio }
        : {}),
      ...(ubicacion ? { ubicacion_etapa: ubicacion } : {}),
      ...(selected.observacionesEleccion?.trim()
        ? { indicaciones: selected.observacionesEleccion.trim() }
        : {}),
    });
  }

  return {
    servicio_principal: {
      ID_Servicio: principalId,
      Principal: true,
      fecha_inicio_servicio: startDate,
      fecha_fin_servicio: principalEndDate,
      horario_servicio: DEFAULT_JORNADA,
    },
    servicios_secundarios,
  };
}

export const buildSolicitudInventarioPayload = (
  products: {
    productId: string;
    intent: "alquilar" | "comprar";
    quantity: number;
    days?: number;
  }[],
): PostRequestInventoryDTO[] =>
  products
    .map((product) => {
      const inventoryId = Number(product.productId.replace(/^product-/, ""));
      if (!inventoryId) return null;
      return {
        ID_Inventario: inventoryId,
        cantidad: product.quantity,
        intencion: product.intent,
        dias_alquilados:
          product.intent === "alquilar" ? (product.days ?? 1) : 0,
      };
    })
    .filter((item): item is PostRequestInventoryDTO => item != null);
