import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, type Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Jornada } from '../types';

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Props {
  jornadas: Jornada[];
  onSelectDate: (date: Date) => void;
  personalRequerido: number;
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

export function WorkCalendar({
  jornadas,
  onSelectDate,
  personalRequerido,
  fechaInicio,
  fechaFin,
}: Props) {
  const events: Event[] = useMemo(
    () =>
      jornadas.map((j) => ({
        title: `${j.Trabajador_Nombre} ${j.Trabajador_Apellido} (${j.horario_entrada}-${j.horario_salida})`,
        start: new Date(`${j.dia}T${j.horario_entrada}`),
        end: new Date(`${j.dia}T${j.horario_salida}`),
        resource: j,
      })),
    [jornadas],
  );

  // Count unique workers per day (avoid double-count if same DNI shows twice)
  const assignedByDay = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const j of jornadas) {
      const key = j.dia?.slice(0, 10);
      if (!key) continue;
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(j.DNI_Trabajador);
    }
    const counts = new Map<string, number>();
    map.forEach((set, k) => counts.set(k, set.size));
    return counts;
  }, [jornadas]);

  const start = useMemo(() => parseISODateOnly(fechaInicio), [fechaInicio]);
  const end = useMemo(() => parseISODateOnly(fechaFin), [fechaFin]);

  const dayPropGetter = (date: Date) => {
    const key = toDateKey(date);
    const assigned = assignedByDay.get(key) ?? 0;
    const inRange =
      (!start || date >= start) && (!end || date <= end);

    if (!inRange) return {};

    // Personal completo (con al menos el requerido) → verde
    if (personalRequerido > 0 && assigned >= personalRequerido) {
      return {
        style: {
          backgroundColor: 'rgba(34, 197, 94, 0.18)',
          border: '1px solid rgba(34, 197, 94, 0.45)',
        },
      };
    }
    // Personal incompleto (algo o nada) → rojo
    if (personalRequerido > 0) {
      return {
        style: {
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.40)',
        },
      };
    }
    // Sin requerimiento definido pero con asignaciones → verde suave
    if (assigned > 0) {
      return {
        style: {
          backgroundColor: 'rgba(34, 197, 94, 0.12)',
        },
      };
    }
    return {};
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 shrink-0">
        <p className="text-xs text-muted-foreground">
          Haz clic en un día para gestionar el personal
          {personalRequerido > 0 && (
            <>
              {' · '}
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-sm bg-green-500/60" />
                completo
              </span>
              {' · '}
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-sm bg-red-500/60" />
                incompleto
              </span>
            </>
          )}
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
          onSelectSlot={(slot) => onSelectDate(slot.start)}
          onSelectEvent={(event) =>
            onSelectDate((event as Event & { start: Date }).start)
          }
          selectable
          dayPropGetter={dayPropGetter}
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
