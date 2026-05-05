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
  projectName: string;
}

export function WorkCalendar({ jornadas, onSelectDate, projectName }: Props) {
  const events: Event[] = useMemo(() =>
    jornadas.map((j) => ({
      title: `${j.Trabajador_Nombre} ${j.Trabajador_Apellido} (${j.horario_entrada}-${j.horario_salida})`,
      start: new Date(`${j.dia}T${j.horario_entrada}`),
      end: new Date(`${j.dia}T${j.horario_salida}`),
      resource: j,
    })),
    [jornadas]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <h2 className="text-lg font-semibold">{projectName || 'Selecciona un proyecto'}</h2>
        <p className="text-xs text-muted-foreground">Personal requerido — haz clic en un día para gestionar</p>
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
          onSelectEvent={(event) => onSelectDate((event as Event & { start: Date }).start)}
          selectable
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
