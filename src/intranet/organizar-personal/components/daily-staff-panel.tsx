import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { trabajoService, perfilService } from '../services/organizar-personal.service';
import type { Jornada, TrabajadorDisponible } from '../types';

interface Props {
  selectedDate: Date | null;
  idTrabajo: number | null;
  jornadas: Jornada[];
  onRefresh: () => void;
}

export function DailyStaffPanel({ selectedDate, idTrabajo, jornadas, onRefresh }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [disponibles, setDisponibles] = useState<TrabajadorDisponible[]>([]);
  const [form, setForm] = useState({
    DNI_Trabajador: '',
    horario_entrada: '07:00',
    horario_salida: '19:00',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  const dayJornadas = jornadas.filter((j) => j.dia?.slice(0, 10) === dateStr);

  useEffect(() => {
    if (!dateStr || !adding) return;
    perfilService
      .getAvailable(dateStr)
      .then(setDisponibles)
      .catch(() => setDisponibles([]));
  }, [dateStr, adding]);

  const handleAdd = async () => {
    if (!idTrabajo || !dateStr || !form.DNI_Trabajador) return;
    setSaving(true);
    setError(null);
    try {
      await trabajoService.createJornada(idTrabajo, {
        DNI_Trabajador: form.DNI_Trabajador,
        dia: dateStr,
        horario_entrada: form.horario_entrada,
        horario_salida: form.horario_salida,
      });
      setAdding(false);
      setForm({ DNI_Trabajador: '', horario_entrada: '07:00', horario_salida: '19:00' });
      onRefresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (jornada: Jornada) => {
    if (!idTrabajo) return;
    if (!window.confirm(`¿Eliminar a ${jornada.Trabajador_Nombre} de este día?`)) return;
    try {
      await trabajoService.deleteJornada(idTrabajo, jornada.Id_Jornada);
      onRefresh();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Error al eliminar');
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

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 shrink-0 border-b">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Fecha seleccionada</p>
        <h3 className="font-semibold text-sm">
          {format(selectedDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
        </h3>
      </div>

      <div className="px-4 pt-3 pb-1 shrink-0 flex items-center justify-between">
        <span className="text-sm font-medium">Personal ({dayJornadas.length})</span>
        <div className="flex gap-2">
          {!adding && (
            <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
              <Plus className="w-3 h-3 mr-1" /> Agregar
            </Button>
          )}
          {editingId !== null && (
            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
              <X className="w-3 h-3 mr-1" /> Cancelar edición
            </Button>
          )}
        </div>
      </div>

      {adding && (
        <div className="mx-4 mb-3 p-3 border rounded-xl bg-orange-50 space-y-2 shrink-0">
          <p className="text-xs font-medium">Nuevo trabajador</p>
          <select
            className="w-full border rounded-md text-sm px-2 py-1.5 bg-white"
            value={form.DNI_Trabajador}
            onChange={(e) => setForm((f) => ({ ...f, DNI_Trabajador: e.target.value }))}
          >
            <option value="">— Selecciona trabajador —</option>
            {disponibles.map((d) => (
              <option key={d.dni} value={d.dni}>
                {d.nombre} {d.apellidos} ({d.rol})
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Entrada</label>
              <Input
                type="time"
                value={form.horario_entrada}
                onChange={(e) => setForm((f) => ({ ...f, horario_entrada: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Salida</label>
              <Input
                type="time"
                value={form.horario_salida}
                onChange={(e) => setForm((f) => ({ ...f, horario_salida: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setError(null); }}>
              <X className="w-3 h-3" />
            </Button>
            <Button size="sm" onClick={handleAdd} disabled={saving || !form.DNI_Trabajador}>
              <Check className="w-3 h-3 mr-1" /> Guardar
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
        {dayJornadas.map((j) => {
          const isEditing = editingId === j.Id_Jornada;
          return (
            <div
              key={j.Id_Jornada}
              className={`rounded-xl border p-3 text-sm transition-all ${
                isEditing ? 'border-orange-400 bg-orange-50' : 'bg-white'
              }`}
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
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setEditingId(isEditing ? null : j.Id_Jornada)}
                    className="p-1 rounded hover:bg-gray-100"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(j)}
                    className="p-1 rounded hover:bg-red-50"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
