import type { Trabajo } from "@/intranet/organizar-personal/types";
import { normalizeTime } from "@/intranet/quotation/lib/quotationSchedule";
import type { CotizacionServicioJornada } from "./cotizacion-jornada";
import {
  getServiciosActivosEnFecha,
} from "./cotizacion-jornada";
import { jornadaDurationHours } from "./informe-duration-analytics";

export interface DayJornada {
  fecha: string;
  inicio: string;
  fin: string;
  horasProgramadas: number;
}

export interface ServiceDayJornada {
  servicioNombre: string;
  isPrincipal: boolean;
  inicio: string;
  fin: string;
  horasProgramadas: number;
}

const timeToMinutes = (time: string): number => {
  const t = normalizeTime(time);
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const jornadaHoursBetween = (inicio: string, fin: string): number => {
  const start = timeToMinutes(inicio);
  const end = timeToMinutes(fin);
  if (!start && !end) return 0;
  if (end > start) return Math.round(((end - start) / 60) * 10) / 10;
  if (end <= start) {
    return jornadaDurationHours(inicio, fin);
  }
  return 0;
};

/** Jornada programada del día según slots TRABAJO del proyecto (fallback). */
export function getJornadaForDay(
  trabajos: Trabajo[],
  fecha: string,
): DayJornada | null {
  const daySlots = trabajos.filter((t) => t.dia?.slice(0, 10) === fecha);
  if (daySlots.length === 0) return null;

  const entradas = daySlots
    .map((t) => normalizeTime(t.horario_entrada))
    .filter(Boolean)
    .sort();
  const salidas = daySlots
    .map((t) => normalizeTime(t.horario_salida))
    .filter(Boolean)
    .sort();

  const inicio = entradas[0] ?? "";
  const fin = salidas[salidas.length - 1] ?? "";

  if (!inicio || !fin) return null;

  return {
    fecha,
    inicio,
    fin,
    horasProgramadas: jornadaHoursBetween(inicio, fin),
  };
}

/** Jornadas por servicio de la cotización activas en una fecha. */
export function getJornadasFromCotizacion(
  servicios: CotizacionServicioJornada[],
  fecha: string,
): ServiceDayJornada[] {
  return getServiciosActivosEnFecha(servicios, fecha).map((s) => ({
    servicioNombre: s.nombre,
    isPrincipal: s.isPrincipal,
    inicio: s.jornadaInicio,
    fin: s.jornadaFin,
    horasProgramadas: jornadaDurationHours(s.jornadaInicio, s.jornadaFin),
  }));
}

/** Mapa fecha → fin de jornada (fallback desde trabajos). */
export function buildJornadaFinPorDia(
  trabajos: Trabajo[],
): Record<string, string> {
  const map: Record<string, string> = {};
  const fechas = [...new Set(trabajos.map((t) => t.dia?.slice(0, 10)).filter(Boolean))];
  for (const fecha of fechas) {
    const j = getJornadaForDay(trabajos, fecha);
    if (j?.fin) map[fecha] = j.fin;
  }
  return map;
}

export function formatJornadaRange(jornada: DayJornada | null): string {
  if (!jornada) return "Sin jornada programada para este día";
  return `${jornada.inicio} – ${jornada.fin} (${jornada.horasProgramadas} h programadas)`;
}

export function formatJornadasCotizacion(jornadas: ServiceDayJornada[]): string {
  if (jornadas.length === 0) return "Sin jornada programada para este día";
  return jornadas
    .map(
      (j) =>
        `${j.servicioNombre}${j.isPrincipal ? " (principal)" : ""}: ${j.inicio} – ${j.fin} (${j.horasProgramadas} h)`,
    )
    .join(" · ");
}

/** Horas programadas totales del día según cotización (suma de servicios activos). */
export function totalHorasProgramadasCotizacion(
  servicios: CotizacionServicioJornada[],
  fecha: string,
): number {
  return getJornadasFromCotizacion(servicios, fecha).reduce(
    (acc, j) => acc + j.horasProgramadas,
    0,
  );
}
