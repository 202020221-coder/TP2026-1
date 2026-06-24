import type { Informe, ProyectoEtapa } from "../interfaces/informe";
import { normalizeTime } from "@/intranet/quotation/lib/quotationSchedule";
import type { CotizacionServicioJornada } from "./cotizacion-jornada";
import { getJornadaForProyectoEtapa } from "./cotizacion-jornada";

export interface ActivityDurationSpan {
  etapaId: number;
  actividadId: number | null;
  etapaNombre: string;
  actividadNombre: string;
  fecha: string;
  inicio: string;
  fin: string;
  duracionMinutos: number;
  duracionHoras: number;
  servicioNombre?: string;
}

export interface EtapaRealDuration {
  etapaId: number;
  etapaNombre: string;
  orden: number;
  horasReales: number;
  horasProgramadas: number;
  estado: string;
}

const informeKey = (inf: Informe): string =>
  `${inf.id_proyecto_etapa ?? 0}-${inf.id_proyecto_actividad ?? 0}`;

/** Convierte fecha + hora del informe a timestamp (ms). */
export const informeToTimestamp = (fecha: string | null, hora: string): number => {
  if (!fecha) return 0;
  const datePart = fecha.slice(0, 10);
  const timePart = normalizeTime(hora) || "00:00";
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm).getTime();
};

const minutesBetween = (startMs: number, endMs: number): number =>
  Math.max(0, Math.round((endMs - startMs) / 60_000));

const formatHora = (ms: number): string => {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** Fin de jornada en ms; si cruza medianoche (ej. 20:00–08:00), suma un día. */
export const resolveJornadaEndMs = (
  fecha: string,
  jornadaInicio: string,
  jornadaFin: string,
): number => {
  const startMs = informeToTimestamp(fecha, jornadaInicio);
  let endMs = informeToTimestamp(fecha, jornadaFin);
  if (endMs <= startMs) {
    endMs += 24 * 60 * 60 * 1000;
  }
  return endMs;
};

const resolveEtapaNombre = (
  etapas: ProyectoEtapa[],
  etapaId: number,
  inf?: Informe,
): string =>
  etapas.find((e) => e.id === etapaId)?.nombre ??
  inf?.etapa?.nombre ??
  `Etapa #${etapaId}`;

const resolveActividadNombre = (
  etapas: ProyectoEtapa[],
  etapaId: number,
  actividadId: number | null,
  inf?: Informe,
): string => {
  if (!actividadId) return "—";
  const act = etapas
    .find((e) => e.id === etapaId)
    ?.actividades?.find((a) => a.id === actividadId);
  return act?.nombre ?? inf?.actividad?.nombre ?? `Actividad #${actividadId}`;
};

/**
 * Determina el fin de un span según jornada del servicio:
 * - Si hay siguiente suceso distinto → fin en ese suceso.
 * - Si el último informe es después de la jornada → fin = última mención (horas extra).
 * - Si el último informe es antes del fin de jornada (o es el último día del servicio) → fin = cierre de jornada.
 * Los spans se calculan por día; no se asume continuidad nocturna entre días.
 */
const resolveSpanEndMs = (
  fecha: string,
  key: string,
  sortedDayInformes: Informe[],
  startMs: number,
  jornadaInicio: string,
  jornadaFin: string,
  fechaFinServicio: string,
): number => {
  const jornadaEndMs = resolveJornadaEndMs(fecha, jornadaInicio, jornadaFin);

  const sameKeyInformes = sortedDayInformes.filter((inf) => informeKey(inf) === key);
  const lastSameKeyMs = Math.max(
    ...sameKeyInformes.map((inf) => informeToTimestamp(inf.fecha, inf.hora)),
  );

  const nextOther = sortedDayInformes.find(
    (inf) =>
      informeKey(inf) !== key &&
      informeToTimestamp(inf.fecha, inf.hora) > startMs,
  );

  if (nextOther) {
    return informeToTimestamp(nextOther.fecha, nextOther.hora);
  }

  const isServiceLastDay =
    Boolean(fechaFinServicio) && fecha >= fechaFinServicio.slice(0, 10);
  const lastAfterJornada = lastSameKeyMs > jornadaEndMs;

  if (lastAfterJornada) {
    return lastSameKeyMs;
  }

  if (isServiceLastDay || lastSameKeyMs <= jornadaEndMs) {
    return jornadaEndMs;
  }

  return jornadaEndMs;
};

export interface ComputeSpansOptions {
  informes: Informe[];
  etapas: ProyectoEtapa[];
  serviciosCotizacion?: CotizacionServicioJornada[];
  jornadaFinPorDia?: Record<string, string>;
  jornadaInicioPorDia?: Record<string, string>;
}

/**
 * Calcula inicio/fin de cada etapa+actividad por día según informes y jornada del
 * servicio que corresponde a la etapa (principal o subservicio independiente).
 */
export function computeActivitySpansFromInformes(
  options: ComputeSpansOptions | Informe[],
  etapasLegacy?: ProyectoEtapa[],
  jornadaFinPorDiaLegacy?: Record<string, string>,
): ActivityDurationSpan[] {
  const opts: ComputeSpansOptions = Array.isArray(options)
    ? {
        informes: options,
        etapas: etapasLegacy ?? [],
        jornadaFinPorDia: jornadaFinPorDiaLegacy,
      }
    : options;

  const { informes, etapas, serviciosCotizacion = [], jornadaFinPorDia } = opts;
  const etapaOrdenById = new Map(etapas.map((e) => [e.id, e.orden]));

  const withEtapa = informes.filter(
    (inf) => inf.id_proyecto_etapa && inf.fecha && inf.hora,
  );

  const byDay = new Map<string, Informe[]>();
  for (const inf of withEtapa) {
    const day = inf.fecha!.slice(0, 10);
    const list = byDay.get(day) ?? [];
    list.push(inf);
    byDay.set(day, list);
  }

  const spans: ActivityDurationSpan[] = [];

  for (const [fecha, dayInformes] of byDay) {
    const sorted = [...dayInformes].sort(
      (a, b) =>
        informeToTimestamp(a.fecha, a.hora) - informeToTimestamp(b.fecha, b.hora),
    );

    const keysInDay = [...new Set(sorted.map(informeKey))];

    for (const key of keysInDay) {
      const [etapaIdRaw, actividadIdRaw] = key.split("-");
      const etapaId = Number(etapaIdRaw);
      const actividadId = actividadIdRaw === "0" ? null : Number(actividadIdRaw);

      const first = sorted.find((inf) => informeKey(inf) === key);
      if (!first) continue;

      const etapaOrden = etapaOrdenById.get(etapaId) ?? 0;
      const jornadaEtapa = getJornadaForProyectoEtapa(
        serviciosCotizacion,
        etapaOrden,
        fecha,
      );

      const jornadaInicio =
        jornadaEtapa?.inicio ??
        opts.jornadaInicioPorDia?.[fecha] ??
        "08:00";
      const jornadaFin =
        jornadaEtapa?.fin ??
        jornadaFinPorDia?.[fecha] ??
        "17:00";
      const fechaFinServicio = jornadaEtapa?.fechaFinServicio ?? "";

      const startMs = informeToTimestamp(first.fecha, first.hora);
      const endMs = resolveSpanEndMs(
        fecha,
        key,
        sorted,
        startMs,
        jornadaInicio,
        jornadaFin,
        fechaFinServicio,
      );

      const duracionMinutos = minutesBetween(startMs, endMs);

      spans.push({
        etapaId,
        actividadId,
        etapaNombre: resolveEtapaNombre(etapas, etapaId, first),
        actividadNombre: resolveActividadNombre(etapas, etapaId, actividadId, first),
        fecha,
        inicio: formatHora(startMs),
        fin: formatHora(endMs),
        duracionMinutos,
        duracionHoras: Math.round((duracionMinutos / 60) * 10) / 10,
        servicioNombre: jornadaEtapa?.servicioNombre,
      });
    }
  }

  return spans.sort(
    (a, b) =>
      a.fecha.localeCompare(b.fecha) ||
      a.inicio.localeCompare(b.inicio) ||
      a.etapaId - b.etapaId,
  );
}

const countDaysInclusive = (start: string, end: string): number => {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, diff);
};

/** Agrega duraciones reales por etapa en horas (y horas programadas según jornada×días). */
export function computeEtapaRealDurations(
  etapas: ProyectoEtapa[],
  spans: ActivityDurationSpan[],
  serviciosCotizacion: CotizacionServicioJornada[] = [],
): EtapaRealDuration[] {
  const sorted = [...etapas].sort((a, b) => a.orden - b.orden);

  return sorted.map((etapa) => {
    const etapaSpans = spans.filter((s) => s.etapaId === etapa.id);
    const horasReales = etapaSpans.reduce((acc, s) => acc + s.duracionHoras, 0);

    const servicio =
      serviciosCotizacion.find(
        (s) => !s.isPrincipal && s.faseOrden === etapa.orden,
      ) ?? serviciosCotizacion.find((s) => s.isPrincipal);

    let horasProgramadas = 0;
    if (servicio) {
      const jornadaH = jornadaDurationHours(servicio.jornadaInicio, servicio.jornadaFin);
      const dias = servicio.fechaInicio && servicio.fechaFin
        ? countDaysInclusive(servicio.fechaInicio, servicio.fechaFin)
        : Math.max(1, etapa.duracion);
      horasProgramadas = Math.round(jornadaH * dias * 10) / 10;
    }

    return {
      etapaId: etapa.id,
      etapaNombre: etapa.nombre,
      orden: etapa.orden,
      horasReales: Math.round(horasReales * 10) / 10,
      horasProgramadas,
      estado: etapa.estado,
    };
  });
}

export const formatDurationHours = (hours: number): string => {
  if (hours <= 0) return "—";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
};

export const jornadaDurationHours = (inicio: string, fin: string): number => {
  const ms =
    resolveJornadaEndMs("2000-01-01", inicio, fin) -
    informeToTimestamp("2000-01-01", inicio);
  return Math.round((ms / 3_600_000) * 10) / 10;
};
