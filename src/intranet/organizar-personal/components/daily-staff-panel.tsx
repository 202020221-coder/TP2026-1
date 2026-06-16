import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, UserPlus, UserMinus, Save, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  trabajoService,
  perfilService,
} from '../services/organizar-personal.service';
import type { Trabajo, PerfilDisponible, Asistencia } from '../types';

interface Props {
  selectedDate: Date | null;
  trabajos: Trabajo[];
  onRefresh: () => void;
  fechaInicio: string | null;
  fechaFin: string | null;
  canEdit: boolean;
}

const ASISTENCIAS: Asistencia[] = ['Programada', 'Cancelada', 'Realizada'];

const parseISODateOnly = (iso: string | null): Date | null => {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const hhmm = (t: string) => (t ? t.slice(0, 5) : '');

/** Dos jornadas (HH:mm:ss) se solapan si comparten algún instante. */
const overlaps = (
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean => aStart < bEnd && bStart < aEnd;

const friendlyError = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; error?: string }
      | string
      | undefined;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
    if (err.response?.status === 500) {
      return 'El servidor no pudo procesar la solicitud. Verifica los datos e inténtalo de nuevo.';
    }
    if (err.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Verifica tu conexión.';
    }
  }
  if (err instanceof Error && err.message && !err.message.startsWith('Request failed')) {
    return err.message;
  }
  return fallback;
};

const asistenciaClass = (a: Asistencia | null): string => {
  switch (a) {
    case 'Realizada':
      return 'bg-green-50 text-green-700 border-green-300';
    case 'Cancelada':
      return 'bg-red-50 text-red-700 border-red-300';
    default:
      return 'bg-blue-50 text-blue-700 border-blue-300';
  }
};

export function DailyStaffPanel({
  selectedDate,
  trabajos,
  onRefresh,
  fechaInicio,
  fechaFin,
  canEdit,
}: Props) {
  const [disponiblesByProfesion, setDisponiblesByProfesion] = useState<
    Record<string, PerfilDisponible[]>
  >({});
  const [loadingDisponibles, setLoadingDisponibles] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const projectStart = useMemo(() => parseISODateOnly(fechaInicio), [fechaInicio]);
  const projectEnd = useMemo(() => parseISODateOnly(fechaFin), [fechaFin]);
  const isWithinProject = useMemo(() => {
    if (!selectedDate) return false;
    if (projectStart && selectedDate < projectStart) return false;
    if (projectEnd && selectedDate > projectEnd) return false;
    return true;
  }, [selectedDate, projectStart, projectEnd]);

  const dayTrabajos = useMemo(
    () =>
      trabajos
        .filter((t) => t.dia?.slice(0, 10) === dateStr)
        .sort(
          (a, b) =>
            a.horario_entrada.localeCompare(b.horario_entrada) ||
            a.Id_trabajo - b.Id_trabajo,
        ),
    [trabajos, dateStr],
  );

  // Profesiones presentes ese día (para precargar disponibles por profesión).
  const profesionesKey = useMemo(
    () =>
      [...new Set(dayTrabajos.map((t) => t.profesion).filter(Boolean))]
        .sort()
        .join('|'),
    [dayTrabajos],
  );

  useEffect(() => {
    if (!dateStr || !profesionesKey) {
      setDisponiblesByProfesion({});
      return;
    }
    const profesiones = profesionesKey.split('|');
    let cancelled = false;
    setLoadingDisponibles(true);
    Promise.all(
      profesiones.map((p) =>
        perfilService
          .getDisponibles(dateStr, p)
          .then((list) => [p, list] as const)
          .catch(() => [p, [] as PerfilDisponible[]] as const),
      ),
    )
      .then((entries) => {
        if (cancelled) return;
        const map: Record<string, PerfilDisponible[]> = {};
        for (const [p, list] of entries) map[p] = list;
        setDisponiblesByProfesion(map);
      })
      .finally(() => {
        if (!cancelled) setLoadingDisponibles(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dateStr, profesionesKey]);

  const completados = dayTrabajos.filter((t) => t.DNI_Trabajador).length;
  const total = dayTrabajos.length;
  const completo = total > 0 && completados >= total;

  const runMutation = async (
    id: number,
    body: Parameters<typeof trabajoService.update>[1],
    successMsg: string,
  ) => {
    setPendingId(id);
    try {
      await trabajoService.update(id, body);
      toast.success(successMsg);
      onRefresh();
    } catch (e) {
      toast.error(friendlyError(e, 'No se pudo actualizar el trabajo'));
      onRefresh();
    } finally {
      setPendingId(null);
    }
  };

  if (!selectedDate) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground px-4 text-center">
        Selecciona un día en el calendario para ver el personal asignado.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 shrink-0 border-b">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Fecha seleccionada
        </p>
        <h3 className="font-semibold text-sm">
          {format(selectedDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
        </h3>
        {total > 0 && (
          <span
            className={`mt-1 inline-block text-[11px] px-2 py-0.5 rounded-full border ${
              completo
                ? 'bg-green-50 text-green-700 border-green-300'
                : 'bg-orange-50 text-orange-700 border-orange-300'
            }`}
          >
            {completados} / {total} asignados
          </span>
        )}
      </div>

      {!canEdit && (
        <div className="mx-4 my-3 p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-700 shrink-0">
          Vista de solo lectura. No puedes asignar trabajadores.
        </div>
      )}

      {canEdit && !isWithinProject && (
        <div className="mx-4 my-3 p-3 border border-amber-300 rounded-xl bg-amber-50 text-xs text-amber-800 shrink-0">
          Este día está fuera del rango del proyecto.
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {total === 0 && (
          <p className="text-sm text-muted-foreground text-center pt-6">
            No hay trabajos programados para este día.
          </p>
        )}

        {dayTrabajos.map((slot) => {
          // DNIs ocupados en horarios que se solapan con este slot (otros slots
          // del mismo día). Evita asignar el mismo trabajador a la misma franja.
          const busyDnis = new Set(
            dayTrabajos
              .filter(
                (o) =>
                  o.Id_trabajo !== slot.Id_trabajo &&
                  o.DNI_Trabajador &&
                  overlaps(
                    slot.horario_entrada,
                    slot.horario_salida,
                    o.horario_entrada,
                    o.horario_salida,
                  ),
              )
              .map((o) => o.DNI_Trabajador as string),
          );

          return (
            <SlotCard
              key={slot.Id_trabajo}
              slot={slot}
              disponibles={disponiblesByProfesion[slot.profesion] ?? []}
              loadingDisponibles={loadingDisponibles}
              busyDnis={busyDnis}
              canEdit={canEdit && isWithinProject}
              pending={pendingId === slot.Id_trabajo}
              onAssign={(dni) =>
                runMutation(
                  slot.Id_trabajo,
                  { DNI_Trabajador: dni, asistencia: slot.asistencia ?? 'Programada' },
                  'Trabajador asignado',
                )
              }
              onUnassign={() =>
                runMutation(
                  slot.Id_trabajo,
                  { DNI_Trabajador: null },
                  'Asignación removida',
                )
              }
              onSaveDetails={(asistencia, comentario) =>
                runMutation(
                  slot.Id_trabajo,
                  { asistencia, comentario },
                  'Trabajo actualizado',
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
}

interface SlotCardProps {
  slot: Trabajo;
  disponibles: PerfilDisponible[];
  loadingDisponibles: boolean;
  busyDnis: Set<string>;
  canEdit: boolean;
  pending: boolean;
  onAssign: (dni: string) => void;
  onUnassign: () => void;
  onSaveDetails: (asistencia: Asistencia, comentario: string) => void;
}

function SlotCard({
  slot,
  disponibles,
  loadingDisponibles,
  busyDnis,
  canEdit,
  pending,
  onAssign,
  onUnassign,
  onSaveDetails,
}: SlotCardProps) {
  const [selectedDni, setSelectedDni] = useState('');
  const [asistencia, setAsistencia] = useState<Asistencia>(
    slot.asistencia ?? 'Programada',
  );
  const [comentario, setComentario] = useState(slot.comentario ?? '');

  // Resync cuando el slot cambia tras un refresh.
  useEffect(() => {
    setAsistencia(slot.asistencia ?? 'Programada');
    setComentario(slot.comentario ?? '');
    setSelectedDni('');
  }, [slot.asistencia, slot.comentario, slot.DNI_Trabajador]);

  const asignado = Boolean(slot.DNI_Trabajador);

  const seleccionables = useMemo(
    () => disponibles.filter((d) => !busyDnis.has(d.DNI)),
    [disponibles, busyDnis],
  );

  const detailsChanged =
    asistencia !== (slot.asistencia ?? 'Programada') ||
    comentario !== (slot.comentario ?? '');

  return (
    <div className="rounded-xl border bg-white p-3 text-sm space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium capitalize">{slot.profesion || '—'}</span>
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {hhmm(slot.horario_entrada)} – {hhmm(slot.horario_salida)}
        </span>
      </div>

      {asignado ? (
        <>
          <div className="rounded-lg bg-gray-50 px-2 py-1.5">
            <p className="font-medium truncate">
              {slot.Trabajador_Nombre} {slot.Trabajador_Apellido}
            </p>
            <p className="text-xs text-gray-400">DNI: {slot.DNI_Trabajador}</p>
          </div>

          {canEdit ? (
            <>
              <div className="flex gap-2">
                <select
                  className="flex-1 border rounded-md text-xs px-2 py-1.5 bg-white"
                  value={asistencia}
                  onChange={(e) => setAsistencia(e.target.value as Asistencia)}
                  disabled={pending}
                >
                  {ASISTENCIAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                value={comentario}
                placeholder="Comentario"
                onChange={(e) => setComentario(e.target.value)}
                disabled={pending}
                className="text-xs h-8"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-red-500 hover:bg-red-50"
                  onClick={onUnassign}
                  disabled={pending}
                >
                  {pending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <UserMinus className="w-3 h-3 mr-1" />
                  )}
                  Quitar
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onSaveDetails(asistencia, comentario)}
                  disabled={pending || !detailsChanged}
                >
                  <Save className="w-3 h-3 mr-1" />
                  Guardar
                </Button>
              </div>
            </>
          ) : (
            <span
              className={`inline-block text-[11px] px-2 py-0.5 rounded-full border ${asistenciaClass(
                slot.asistencia,
              )}`}
            >
              {slot.asistencia ?? 'Programada'}
            </span>
          )}
        </>
      ) : canEdit ? (
        <div className="space-y-2">
          <select
            className="w-full border rounded-md text-xs px-2 py-1.5 bg-white"
            value={selectedDni}
            onChange={(e) => setSelectedDni(e.target.value)}
            disabled={loadingDisponibles || pending}
          >
            <option value="">
              {loadingDisponibles
                ? 'Cargando disponibles…'
                : `— ${slot.profesion} disponible —`}
            </option>
            {seleccionables.map((d) => (
              <option key={d.DNI} value={d.DNI}>
                {d.Nombre} {d.Apellido}
                {d.estado === 'en trabajo' ? ' (en trabajo)' : ''}
              </option>
            ))}
          </select>
          {!loadingDisponibles && seleccionables.length === 0 && (
            <p className="text-xs text-amber-600">
              No hay {slot.profesion} disponible para esta jornada.
            </p>
          )}
          <Button
            size="sm"
            className="h-7 text-xs w-full"
            onClick={() => selectedDni && onAssign(selectedDni)}
            disabled={pending || !selectedDni}
          >
            {pending ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <UserPlus className="w-3 h-3 mr-1" />
            )}
            Asignar
          </Button>
        </div>
      ) : (
        <span className="text-xs text-gray-400">Sin asignar</span>
      )}
    </div>
  );
}
