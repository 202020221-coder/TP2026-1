import axiosInstance from "@/shared/api/axios.config";
import { normalizeTime, parseJornada } from "@/intranet/quotation/lib/quotationSchedule";

export interface CotizacionServicioJornada {
  idServicio: number;
  nombre: string;
  isPrincipal: boolean;
  /** Orden de etapa (1-based) para subservicios. */
  faseOrden: number | null;
  jornadaInicio: string;
  jornadaFin: string;
  fechaInicio: string;
  fechaFin: string;
}

interface ServicioCotizacionRaw {
  idServicio?: number;
  ID_Servicio?: number;
  id?: number;
  nombre?: string;
  Nombre?: string;
  isPrincipal?: boolean;
  Principal?: boolean;
  faseOrden?: number | null;
  id_servicio_subservicio?: number | null;
  jornada?: string | null;
  jornada_comienzo?: string | null;
  jornada_final?: string | null;
  fecha_inicio?: string;
  fecha_finalizacion?: string;
  fecha_inicio_servicio?: string;
  fecha_fin_servicio?: string;
}

const toDateOnly = (value?: string | null): string => {
  if (!value) return "";
  return value.slice(0, 10);
};

const parseServicio = (raw: ServicioCotizacionRaw): CotizacionServicioJornada | null => {
  const id = raw.idServicio ?? raw.ID_Servicio ?? raw.id;
  if (typeof id !== "number" || !Number.isFinite(id)) return null;

  const fallback = parseJornada(raw.jornada);
  const jornadaInicio = normalizeTime(raw.jornada_comienzo) || fallback.start || "08:00";
  const jornadaFin = normalizeTime(raw.jornada_final) || fallback.end || "17:00";

  const faseOrden =
    raw.faseOrden ??
    (typeof raw.id_servicio_subservicio === "number"
      ? raw.id_servicio_subservicio
      : null);

  return {
    idServicio: id,
    nombre: raw.nombre ?? raw.Nombre ?? `Servicio #${id}`,
    isPrincipal: Boolean(raw.isPrincipal ?? raw.Principal),
    faseOrden: faseOrden ?? null,
    jornadaInicio,
    jornadaFin,
    fechaInicio: toDateOnly(raw.fecha_inicio ?? raw.fecha_inicio_servicio),
    fechaFin: toDateOnly(raw.fecha_finalizacion ?? raw.fecha_fin_servicio),
  };
};

export async function getCotizacionServiciosJornada(
  idCotizacion: number,
): Promise<CotizacionServicioJornada[]> {
  const response = await axiosInstance.get<unknown>(
    `/cotizaciones/${idCotizacion}/services`,
  );
  const raw = response.data;
  const list: ServicioCotizacionRaw[] = Array.isArray(raw)
    ? (raw as ServicioCotizacionRaw[])
    : ((raw as { data?: ServicioCotizacionRaw[] })?.data ?? []);

  return list.map(parseServicio).filter((s): s is CotizacionServicioJornada => s !== null);
}

/** Servicios activos en una fecha según su rango en la cotización. */
export const getServiciosActivosEnFecha = (
  servicios: CotizacionServicioJornada[],
  fecha: string,
): CotizacionServicioJornada[] =>
  servicios.filter((s) => {
    if (!s.fechaInicio && !s.fechaFin) return true;
    if (s.fechaInicio && fecha < s.fechaInicio) return false;
    if (s.fechaFin && fecha > s.fechaFin) return false;
    return true;
  });

/**
 * Jornada de una etapa según el subservicio de su orden; si no hay subservicio
 * dedicado, usa la del servicio principal. El principal no impone horario a los secundarios.
 */
export const getJornadaForEtapaOrden = (
  servicios: CotizacionServicioJornada[],
  etapaOrden: number,
): { inicio: string; fin: string; servicioNombre: string } | null => {
  const sub = servicios.find(
    (s) => !s.isPrincipal && s.faseOrden === etapaOrden,
  );
  if (sub) {
    return {
      inicio: sub.jornadaInicio,
      fin: sub.jornadaFin,
      servicioNombre: sub.nombre,
    };
  }

  const principal = servicios.find((s) => s.isPrincipal);
  if (principal) {
    return {
      inicio: principal.jornadaInicio,
      fin: principal.jornadaFin,
      servicioNombre: principal.nombre,
    };
  }

  return null;
};

export const getJornadaForProyectoEtapa = (
  servicios: CotizacionServicioJornada[],
  etapaOrden: number,
  fecha: string,
): { inicio: string; fin: string; servicioNombre: string; fechaFinServicio: string } | null => {
  const activos = getServiciosActivosEnFecha(servicios, fecha);
  const sub = activos.find((s) => !s.isPrincipal && s.faseOrden === etapaOrden);
  const match = sub ?? activos.find((s) => s.isPrincipal);
  if (!match) return null;

  return {
    inicio: match.jornadaInicio,
    fin: match.jornadaFin,
    servicioNombre: match.nombre,
    fechaFinServicio: match.fechaFin,
  };
};
