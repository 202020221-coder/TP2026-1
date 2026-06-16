import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, type Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
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

  // Cobertura por día: slots totales vs slots con trabajador asignado.
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

  const start = useMemo(() => parseISODateOnly(fechaInicio), [fechaInicio]);
  const end = useMemo(() => parseISODateOnly(fechaFin), [fechaFin]);

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

    // Sin slots ese día → neutro.
    if (!coverage || coverage.total === 0) return {};

    // Ningún slot asignado → rojo.
    if (coverage.asignados === 0) {
      return {
        style: {
          backgroundColor: 'rgba(239, 68, 68, 0.18)',
          border: '1px solid rgba(239, 68, 68, 0.45)',
        },
      };
    }

    // Algunos slots sin asignar → naranja.
    if (coverage.asignados < coverage.total) {
      return {
        style: {
          backgroundColor: 'rgba(249, 115, 22, 0.18)',
          border: '1px solid rgba(249, 115, 22, 0.45)',
        },
      };
    }

    // Todos los slots asignados → verde.
    return {
      style: {
        backgroundColor: 'rgba(34, 197, 94, 0.18)',
        border: '1px solid rgba(34, 197, 94, 0.45)',
      },
    };
  };

  const isDateInProject = (date: Date) =>
    (!start || date >= start) && (!end || date <= end);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 shrink-0">
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
      <div className="flex-1 overflow-hidden px-2 pb-4 min-h-0">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture="es"
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
          messages={{
            next: 'Sig',
            previous: 'Ant',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          }}
        />
      </div>
    </div>
  );
}
