import { useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, type Event } from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Trabajo } from '../types';

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Props {
  trabajos: Trabajo[];
  onSelectDate: (date: Date) => void;
  fechaInicio: string | null;
  fechaFin: string | null;
}

const toDateKey = (date: Date) => format(date, 'yyyy-MM-dd');
const parseISODateOnly = (iso: string | null): Date | null => {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};
const hhmm = (t: string) => (t ? t.slice(0, 5) : '');
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface DayCoverage {
  total: number;
  asignados: number;
}

export function WorkCalendar({
  trabajos,
  onSelectDate,
  fechaInicio,
  fechaFin,
}: Props) {
  const start = useMemo(() => parseISODateOnly(fechaInicio), [fechaInicio]);
  const end = useMemo(() => parseISODateOnly(fechaFin), [fechaFin]);
  const projectStartMonth = useMemo(
    () => (start ? startOfMonth(start) : null),
    [start],
  );
  const projectEndMonth = useMemo(
    () => (end ? startOfMonth(end) : null),
    [end],
  );

  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    startOfMonth(start ?? new Date()),
  );

  useEffect(() => {
    if (start) {
      setVisibleMonth(startOfMonth(start));
    }
  }, [fechaInicio, start]);

  const monthOptions = useMemo(() => {
    if (!projectStartMonth) return [];
    const endMonth = projectEndMonth ?? projectStartMonth;
    const options: { value: string; label: string }[] = [];
    let cursor = projectStartMonth;
    while (cursor <= endMonth) {
      options.push({
        value: format(cursor, 'yyyy-MM'),
        label: capitalize(format(cursor, 'MMMM yyyy', { locale: es })),
      });
      cursor = addMonths(cursor, 1);
    }
    return options;
  }, [projectStartMonth, projectEndMonth]);

  const canGoPrev =
    !projectStartMonth || visibleMonth > projectStartMonth;
  const canGoNext =
    !projectEndMonth || visibleMonth < projectEndMonth;

  const events: Event[] = useMemo(
    () =>
      trabajos.map((t) => {
        const asignado = Boolean(t.DNI_Trabajador);
        const label = asignado
          ? `${t.Trabajador_Nombre ?? ''} ${t.Trabajador_Apellido ?? ''}`.trim()
          : `Sin asignar · ${t.profesion}`;
        return {
          title: `${label} (${hhmm(t.horario_entrada)}-${hhmm(t.horario_salida)})`,
          start: new Date(`${t.dia}T${t.horario_entrada || '00:00:00'}`),
          end: new Date(`${t.dia}T${t.horario_salida || '23:59:00'}`),
          resource: t,
        };
      }),
    [trabajos],
  );

  const coverageByDay = useMemo(() => {
    const map = new Map<string, DayCoverage>();
    for (const t of trabajos) {
      const key = t.dia?.slice(0, 10);
      if (!key) continue;
      const c = map.get(key) ?? { total: 0, asignados: 0 };
      c.total += 1;
      if (t.DNI_Trabajador) c.asignados += 1;
      map.set(key, c);
    }
    return map;
  }, [trabajos]);

  const eventPropGetter = (event: Event) => {
    const t = (event as Event & { resource?: Trabajo }).resource;
    const asignado = Boolean(t?.DNI_Trabajador);
    return {
      style: {
        backgroundColor: asignado ? 'rgb(34, 197, 94)' : 'rgb(148, 163, 184)',
        borderColor: asignado ? 'rgb(22, 163, 74)' : 'rgb(100, 116, 139)',
        fontSize: '11px',
      },
    };
  };

  const dayPropGetter = (date: Date) => {
    const key = toDateKey(date);
    const coverage = coverageByDay.get(key);
    const inRange = (!start || date >= start) && (!end || date <= end);

    if (!inRange) {
      return {
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          color: 'rgba(0, 0, 0, 0.35)',
          pointerEvents: 'none' as const,
          cursor: 'not-allowed',
        },
      };
    }

    if (!coverage || coverage.total === 0) return {};

    if (coverage.asignados === 0) {
      return {
        style: {
          backgroundColor: 'rgba(239, 68, 68, 0.18)',
          border: '1px solid rgba(239, 68, 68, 0.45)',
        },
      };
    }

    if (coverage.asignados < coverage.total) {
      return {
        style: {
          backgroundColor: 'rgba(249, 115, 22, 0.18)',
          border: '1px solid rgba(249, 115, 22, 0.45)',
        },
      };
    }

    return {
      style: {
        backgroundColor: 'rgba(34, 197, 94, 0.18)',
        border: '1px solid rgba(34, 197, 94, 0.45)',
      },
    };
  };

  const isDateInProject = (date: Date) =>
    (!start || date >= start) && (!end || date <= end);

  const serviceRangeLabel = useMemo(() => {
    if (!start && !end) return null;
    const fmt = (d: Date) => format(d, 'dd/MM/yyyy');
    if (start && end) return `${fmt(start)} – ${fmt(end)}`;
    if (start) return `Desde ${fmt(start)}`;
    return `Hasta ${fmt(end!)}`;
  }, [start, end]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 shrink-0 space-y-2 border-b bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setVisibleMonth((m) => subMonths(m, 1))}
              disabled={!canGoPrev}
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {monthOptions.length > 1 ? (
              <select
                className="h-8 min-w-[10rem] rounded-md border border-input bg-white px-2 text-sm font-medium capitalize"
                value={format(visibleMonth, 'yyyy-MM')}
                onChange={(e) => {
                  const [y, m] = e.target.value.split('-').map(Number);
                  setVisibleMonth(new Date(y, m - 1, 1));
                }}
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="px-2 text-sm font-semibold min-w-[10rem] text-center capitalize">
                {capitalize(format(visibleMonth, 'MMMM yyyy', { locale: es }))}
              </span>
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
              disabled={!canGoNext}
              aria-label="Mes siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {serviceRangeLabel && (
            <p className="text-xs text-muted-foreground">
              Servicio: {serviceRangeLabel}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Haz clic en un día para gestionar el personal
          {' · '}
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm bg-red-500/60" />
            sin asignar
          </span>
          {' · '}
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm bg-orange-500/60" />
            parcial
          </span>
          {' · '}
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm bg-green-500/60" />
            completo
          </span>
        </p>
      </div>

      <div className="flex-1 overflow-hidden px-2 pb-4 min-h-0 [&_.rbc-toolbar]:hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture="es"
          date={visibleMonth}
          onNavigate={(date) => setVisibleMonth(startOfMonth(date))}
          views={['month']}
          view="month"
          toolbar={false}
          min={start ?? undefined}
          max={end ?? undefined}
          onSelectSlot={(slot) => {
            if (!isDateInProject(slot.start)) return;
            onSelectDate(slot.start);
          }}
          onSelectEvent={(event) => {
            const evStart = (event as Event & { start: Date }).start;
            if (!isDateInProject(evStart)) return;
            onSelectDate(evStart);
          }}
          selectable
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
        />
      </div>
    </div>
  );
}
