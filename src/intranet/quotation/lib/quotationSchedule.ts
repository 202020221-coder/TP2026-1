import { addDays, differenceInDays, format, parseISO } from "date-fns";
import type { QuotationPhases } from "../interfaces/phases.types";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";

type QuotationService = DesiredQuotationData["services"][number];

const DATE_FMT = "yyyy-MM-dd";

const toDate = (value: string): Date => {
  if (!value) return new Date();
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const fmt = (date: Date): string => format(date, DATE_FMT);

export interface PhaseRange {
  orden: number;
  start: Date;
  end: Date;
  days: number;
}

/**
 * Calcula el rango de fechas de cada etapa a partir del día de inicio del
 * proyecto y la duración acumulada de las etapas anteriores.
 * El inicio de la etapa k = inicio + suma(duraciones 1..k-1); el fin = inicio + duración k.
 */
export const getPhaseRanges = (
  projectStartDate: string,
  phases: QuotationPhases,
): Map<number, PhaseRange> => {
  const base = toDate(projectStartDate);
  const ranges = new Map<number, PhaseRange>();
  let offset = 0;
  phases.items.forEach((phase, index) => {
    const orden = index + 1;
    const duration = Math.max(0, Number(phase.duration) || 0);
    const start = addDays(base, offset);
    const end = addDays(base, offset + duration);
    ranges.set(orden, { orden, start, end, days: duration });
    offset += duration;
  });
  return ranges;
};

/** Rango total del proyecto (inicio del proyecto → inicio + suma de duraciones). */
export const getProjectRange = (
  projectStartDate: string,
  phases: QuotationPhases,
): { start: Date; end: Date; days: number } => {
  const base = toDate(projectStartDate);
  const totalDays = phases.items.reduce(
    (acc, phase) => acc + Math.max(0, Number(phase.duration) || 0),
    0,
  );
  return { start: base, end: addDays(base, totalDays), days: totalDays };
};

export interface ComputedServiceDates {
  startDate: string;
  dueDate: string;
  days: number;
}

/**
 * Calcula las fechas (inicio/fin) y la cantidad de días de un servicio dentro
 * de la cotización. El servicio principal abarca todo el proyecto; un
 * subservicio abarca el rango de la etapa donde ocurre (faseOrden).
 */
export const computeServiceDates = (
  service: Pick<QuotationService, "isPrincipal" | "faseOrden">,
  projectStartDate: string,
  phases: QuotationPhases,
): ComputedServiceDates => {
  const usesPhase = !service.isPrincipal && service.faseOrden != null;

  if (usesPhase) {
    const range = getPhaseRanges(projectStartDate, phases).get(
      service.faseOrden as number,
    );
    if (range) {
      return {
        startDate: fmt(range.start),
        dueDate: fmt(range.end),
        days: range.days,
      };
    }
  }

  const project = getProjectRange(projectStartDate, phases);
  return {
    startDate: fmt(project.start),
    dueDate: fmt(project.end),
    days: project.days,
  };
};

/** Convierte una fecha yyyy-MM-dd en DATETIME con hora 00:00:00. */
export const toDateTimeStart = (date: string): string =>
  date ? `${date}T00:00:00` : "";

/** Costo de un servicio según pago_por_dia: precio × días o solo el precio. */
export const computeServiceCost = (
  service: Pick<QuotationService, "unitPrice" | "pagoPorDia">,
  days: number,
): number => {
  const price = Number(service.unitPrice) || 0;
  if (service.pagoPorDia) {
    return price * Math.max(1, days);
  }
  return price;
};
