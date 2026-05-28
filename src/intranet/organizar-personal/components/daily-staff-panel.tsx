import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Plus, X, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  trabajoService,
  perfilService,
} from '../services/organizar-personal.service';
import type { Jornada, TrabajadorDisponible } from '../types';

interface Props {
  selectedDate: Date | null;
  idTrabajo: number | null;
  jornadas: Jornada[];
  personalRequerido: number;
  onRefresh: () => void;
  fechaInicio: string | null;
  fechaFin: string | null;
}

const parseISODateOnly = (iso: string | null): Date | null => {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

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

const HORARIO_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function DailyStaffPanel({
  selectedDate,
  idTrabajo,
  jornadas,
  personalRequerido,
  onRefresh,
  fechaInicio,
  fechaFin,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [disponibles, setDisponibles] = useState<TrabajadorDisponible[]>([]);
  const [loadingDisponibles, setLoadingDisponibles] = useState(false);
  const [form, setForm] = useState({
    DNI_Trabajador: '',
    horario_entrada: '07:00',
    horario_salida: '19:00',
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const projectStart = useMemo(() => parseISODateOnly(fechaInicio), [fechaInicio]);
  const projectEnd = useMemo(() => parseISODateOnly(fechaFin), [fechaFin]);
  const isWithinProject = useMemo(() => {
    if (!selectedDate) return false;
    if (projectStart && selectedDate < projectStart) return false;
    if (projectEnd && selectedDate > projectEnd) return false;
    return true;
  }, [selectedDate, projectStart, projectEnd]);
  const dayJornadas = useMemo(
    () => jornadas.filter((j) => j.dia?.slice(0, 10) === dateStr),
    [jornadas, dateStr],
  );
  const assignedDnis = useMemo(
    () => new Set(dayJornadas.map((j) => j.DNI_Trabajador)),
    [dayJornadas],
  );

  // Reset form/error when day changes
  useEffect(() => {
    setAdding(false);
    setError(null);
    setForm({
      DNI_Trabajador: '',
      horario_entrada: '07:00',
      horario_salida: '19:00',
    });
  }, [dateStr, idTrabajo]);

  useEffect(() => {
    if (!dateStr || !adding) return;
    setLoadingDisponibles(true);
    perfilService
      .getAvailable(dateStr)
      .then(setDisponibles)
      .catch(() => setDisponibles([]))
      .finally(() => setLoadingDisponibles(false));
  }, [dateStr, adding]);

  // Workers not yet assigned that day
  const seleccionables = useMemo(
    () => disponibles.filter((d) => !assignedDnis.has(d.dni)),
    [disponibles, assignedDnis],
  );

  const validate = (): string | null => {
    if (!form.DNI_Trabajador) return 'Selecciona un trabajador';
    if (assignedDnis.has(form.DNI_Trabajador)) {
      return 'Este trabajador ya está asignado a este día';
    }
    if (
      !HORARIO_RE.test(form.horario_entrada) ||
      !HORARIO_RE.test(form.horario_salida)
    ) {
      return 'Los horarios deben tener el formato HH:MM';
    }
    if (form.horario_salida <= form.horario_entrada) {
      return 'El horario de salida debe ser posterior al de entrada';
    }
    return null;
  };

  const handleAdd = async () => {
    if (!idTrabajo || !dateStr) return;
    if (!isWithinProject) {
      const msg = 'No puedes asignar personal fuera del rango del proyecto';
      setError(msg);
      toast.warning(msg);
      return;
    }
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.warning(validationError);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await trabajoService.createJornada(idTrabajo, {
        DNI_Trabajador: form.DNI_Trabajador,
        dia: dateStr,
        horario_entrada: form.horario_entrada,
        horario_salida: form.horario_salida,
      });
      toast.success('Trabajador asignado correctamente');
      setAdding(false);
      setForm({
        DNI_Trabajador: '',
        horario_entrada: '07:00',
        horario_salida: '19:00',
      });
      onRefresh();
    } catch (e: unknown) {
      const msg = friendlyError(e, 'No se pudo asignar al trabajador');
      setError(msg);
      toast.error(msg);
      // Refresh anyway: backend may have persisted despite returning 500
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (jornada: Jornada) => {
    if (!idTrabajo) return;
    if (!jornada.Id_Jornada) {
      toast.error('No se puede eliminar: la jornada no tiene un identificador válido');
      return;
    }
    if (
      !window.confirm(
        `¿Eliminar a ${jornada.Trabajador_Nombre} ${jornada.Trabajador_Apellido} de este día?`,
      )
    )
      return;
    setDeletingId(jornada.Id_Jornada);
    try {
      await trabajoService.deleteJornada(idTrabajo, jornada.Id_Jornada);
      toast.success('Trabajador eliminado');
      onRefresh();
    } catch (e: unknown) {
      const msg = friendlyError(e, 'No se pudo eliminar al trabajador');
      toast.error(msg);
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  };

  if (!selectedDate) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground px-4 text-center">
        Selecciona un día en el calendario para ver el personal asignado.
      </div>
    );
  }

  if (!idTrabajo) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground px-4 text-center">
        Este proyecto no tiene un registro de Trabajo asociado.
      </div>
    );
  }

  const completo =
    personalRequerido > 0 && dayJornadas.length >= personalRequerido;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 shrink-0 border-b">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Fecha seleccionada
        </p>
        <h3 className="font-semibold text-sm">
          {format(selectedDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
        </h3>
        {personalRequerido > 0 && (
          <span
            className={`mt-1 inline-block text-[11px] px-2 py-0.5 rounded-full border ${
              completo
                ? 'bg-green-50 text-green-700 border-green-300'
                : 'bg-red-50 text-red-700 border-red-300'
            }`}
          >
            {dayJornadas.length} / {personalRequerido}{' '}
            {completo ? 'completo' : 'incompleto'}
          </span>
        )}
      </div>

      <div className="px-4 pt-3 pb-1 shrink-0 flex items-center justify-between">
        <span className="text-sm font-medium">
          Personal ({dayJornadas.length})
        </span>
        {!adding && isWithinProject && (
          <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
            <Plus className="w-3 h-3 mr-1" /> Agregar
          </Button>
        )}
      </div>

      {!isWithinProject && (
        <div className="mx-4 mb-3 p-3 border border-amber-300 rounded-xl bg-amber-50 text-xs text-amber-800 shrink-0">
          Este día está fuera del rango del proyecto. No se puede asignar
          personal.
        </div>
      )}

      {adding && (
        <div className="mx-4 mb-3 p-3 border rounded-xl bg-orange-50 space-y-2 shrink-0">
          <p className="text-xs font-medium">Nuevo trabajador</p>
          <select
            className="w-full border rounded-md text-sm px-2 py-1.5 bg-white"
            value={form.DNI_Trabajador}
            onChange={(e) =>
              setForm((f) => ({ ...f, DNI_Trabajador: e.target.value }))
            }
            disabled={loadingDisponibles}
          >
            <option value="">
              {loadingDisponibles
                ? 'Cargando trabajadores…'
                : '— Selecciona trabajador —'}
            </option>
            {seleccionables.map((d) => (
              <option key={d.dni} value={d.dni}>
                {d.nombre} {d.apellidos} ({d.rol})
              </option>
            ))}
          </select>
          {!loadingDisponibles && seleccionables.length === 0 && (
            <p className="text-xs text-amber-600">
              No hay trabajadores disponibles para asignar este día.
            </p>
          )}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Entrada</label>
              <Input
                type="time"
                value={form.horario_entrada}
                onChange={(e) =>
                  setForm((f) => ({ ...f, horario_entrada: e.target.value }))
                }
                className="text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Salida</label>
              <Input
                type="time"
                value={form.horario_salida}
                onChange={(e) =>
                  setForm((f) => ({ ...f, horario_salida: e.target.value }))
                }
                className="text-sm"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAdding(false);
                setError(null);
              }}
              disabled={saving}
            >
              <X className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={saving || !form.DNI_Trabajador}
            >
              {saving ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Check className="w-3 h-3 mr-1" />
              )}
              Guardar
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {dayJornadas.length === 0 && (
          <p className="text-sm text-muted-foreground text-center pt-6">
            Sin personal asignado para este día.
          </p>
        )}
        {dayJornadas.map((j) => (
          <div
            key={j.Id_Jornada}
            className="rounded-xl border p-3 text-sm bg-white"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {j.Trabajador_Nombre} {j.Trabajador_Apellido}
                </p>
                <p className="text-xs text-gray-500">
                  {j.horario_entrada} – {j.horario_salida}
                </p>
                <p className="text-xs text-gray-400">DNI: {j.DNI_Trabajador}</p>
              </div>
              <button
                onClick={() => handleDelete(j)}
                className="p-1 rounded hover:bg-red-50 disabled:opacity-50"
                title="Eliminar"
                disabled={deletingId === j.Id_Jornada}
              >
                {deletingId === j.Id_Jornada ? (
                  <Loader2 className="w-3.5 h-3.5 text-red-400 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
