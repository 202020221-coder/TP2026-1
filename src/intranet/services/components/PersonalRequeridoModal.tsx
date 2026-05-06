import { useState, useRef, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Servicio, PersonalRequerido, CreatePersonalRequeridoDTO } from "../interfaces/service";
import {
  getPersonalByServicio,
  createPersonal,
  updatePersonal,
  deletePersonal,
} from "../api/service.api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { X, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  servicio: Servicio;
  onClose: () => void;
}

const EMPTY_ROW: CreatePersonalRequeridoDTO = {
  profesion: "", cantidad: 1, disponibilidad: "", requerimiento_legal: "",
};

export const PersonalRequeridoModal: FC<Props> = ({ servicio, onClose }) => {
  const qc = useQueryClient();
  const key = ["personal", servicio.id];

  const { data: personal = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: () => getPersonalByServicio(servicio.id),
    staleTime: 0,
  });

  // Actualiza caché y luego sincroniza con servidor
  const invalidatePersonal = async () => {
    await qc.invalidateQueries({ queryKey: key });
  };

  // Bloqueo anti-doble-click: ref para saber si ya hay un request en vuelo
  const isSubmitting = useRef(false);

  const createMut = useMutation({
    mutationFn: (dto: CreatePersonalRequeridoDTO) => createPersonal(servicio.id, dto),
    onSuccess: async (created) => {
      // Insertar optimistamente en caché
      qc.setQueryData<PersonalRequerido[]>(key, (old = []) => [...old, created]);
      toast.success("Personal agregado correctamente");
      await invalidatePersonal();
    },
    onError: () => {
      toast.error("Error al agregar personal");
    },
    onSettled: () => {
      isSubmitting.current = false;
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CreatePersonalRequeridoDTO> }) =>
      updatePersonal(servicio.id, id, dto),
    onSuccess: async (updated) => {
      // Actualizar optimistamente en caché
      qc.setQueryData<PersonalRequerido[]>(key, (old = []) =>
        old.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      toast.success("Personal actualizado correctamente");
      await invalidatePersonal();
    },
    onError: () => toast.error("Error al actualizar personal"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deletePersonal(servicio.id, id),
    onMutate: async (id) => {
      // Cancelar queries en vuelo para evitar race conditions
      await qc.cancelQueries({ queryKey: key });
      // Snapshot anterior para rollback si falla
      const previous = qc.getQueryData<PersonalRequerido[]>(key);
      // Eliminar optimistamente de caché de inmediato
      qc.setQueryData<PersonalRequerido[]>(key, (old = []) => old.filter((p) => p.id !== id));
      return { previous };
    },
    onSuccess: async () => {
      toast.success("Personal eliminado correctamente");
      await invalidatePersonal();
    },
    onError: (_err, _id, context) => {
      // Rollback si el servidor falla
      if (context?.previous) {
        qc.setQueryData<PersonalRequerido[]>(key, context.previous);
      }
      toast.error("Error al eliminar personal");
    },
  });

  const [adding, setAdding]       = useState(false);
  const [newRow, setNewRow]       = useState<CreatePersonalRequeridoDTO>(EMPTY_ROW);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRow, setEditRow]     = useState<CreatePersonalRequeridoDTO>(EMPTY_ROW);

  const handleAdd = async () => {
    if (!newRow.profesion.trim()) {
      toast.warning("La profesión es requerida");
      return;
    }
    // Anti-doble-click: ignorar si ya hay request en vuelo
    if (isSubmitting.current || createMut.isPending) return;
    isSubmitting.current = true;

    try {
      await createMut.mutateAsync(newRow);
      setNewRow(EMPTY_ROW);
      setAdding(false);
    } catch {
      // Error ya manejado en onError
    }
  };

  const startEdit = (p: PersonalRequerido) => {
    setEditingId(p.id);
    setEditRow({
      profesion: p.profesion,
      cantidad: p.cantidad,
      disponibilidad: p.disponibilidad,
      requerimiento_legal: p.requerimiento_legal,
    });
  };

  const handleUpdate = async (id: number) => {
    if (!editRow.profesion.trim()) {
      toast.warning("La profesión es requerida");
      return;
    }
    try {
      await updateMut.mutateAsync({ id, dto: editRow });
      setEditingId(null);
    } catch {
      // Error ya manejado en onError
    }
  };

  const handleDelete = (id: number) => {
    if (deleteMut.isPending) return;
    deleteMut.mutate(id);
  };

  const colClass = "flex-1 min-w-0";
  const inputCls = "h-8 text-sm bg-green-50 border-green-200 focus:border-green-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">
              ID {servicio.id}
            </p>
            <h2 className="text-base font-semibold text-gray-800">{servicio.nombre}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Personal Requerido</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => { setAdding(true); setEditingId(null); }}
              disabled={adding}
              className="bg-green-500 hover:bg-green-600 text-white gap-1 h-8 text-xs disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar
            </Button>
            <Button size="sm" onClick={onClose} variant="outline" className="h-8 text-xs">
              Cerrar
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {/* Column headers */}
          <div className="flex gap-3 mb-2 px-1">
            {["Profesión", "Cantidad", "Disponibilidad", "Req. Legal"].map((h) => (
              <p key={h} className="flex-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</p>
            ))}
            <div className="w-[100px]" />
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          )}

          {/* Existing rows */}
          {!isLoading && personal.map((p) => (
            <div
              key={p.id}
              className="flex gap-3 items-center py-2 border-b border-gray-100 last:border-0"
            >
              {editingId === p.id ? (
                <>
                  <div className={colClass}>
                    <Input className={inputCls} value={editRow.profesion}
                      onChange={(e) => setEditRow((r) => ({ ...r, profesion: e.target.value }))} />
                  </div>
                  <div className={colClass}>
                    <Input className={inputCls} type="number" min={1} value={editRow.cantidad}
                      onChange={(e) => setEditRow((r) => ({ ...r, cantidad: Number(e.target.value) }))} />
                  </div>
                  <div className={colClass}>
                    <Input className={inputCls} value={editRow.disponibilidad}
                      onChange={(e) => setEditRow((r) => ({ ...r, disponibilidad: e.target.value }))} />
                  </div>
                  <div className={colClass}>
                    <Input className={inputCls} value={editRow.requerimiento_legal}
                      onChange={(e) => setEditRow((r) => ({ ...r, requerimiento_legal: e.target.value }))} />
                  </div>
                  <div className="flex gap-1.5 w-[100px]">
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(p.id)}
                      disabled={updateMut.isPending}
                      className="h-7 text-xs bg-green-500 hover:bg-green-600 text-white flex-1"
                    >
                      {updateMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Guardar"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="h-7 text-xs">
                      ✕
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm text-gray-800">{p.profesion}</p>
                  <p className="flex-1 text-sm text-gray-600">{p.cantidad}</p>
                  <p className="flex-1 text-sm text-gray-600">{p.disponibilidad}</p>
                  <p className="flex-1 text-sm text-gray-600">{p.requerimiento_legal}</p>
                  <div className="flex gap-1.5 w-[100px]">
                    <Button
                      size="sm"
                      onClick={() => startEdit(p)}
                      variant="outline"
                      className="h-7 text-xs border-green-300 text-green-600 hover:bg-green-50 flex-1"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(p.id)}
                      disabled={deleteMut.isPending}
                      className="h-7 text-xs bg-red-500 hover:bg-red-600 text-white flex-1 disabled:opacity-60"
                    >
                      {deleteMut.isPending && deleteMut.variables === p.id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Trash2 className="w-3 h-3" />}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Empty state */}
          {!isLoading && personal.length === 0 && !adding && (
            <p className="text-center text-gray-400 text-sm py-8">
              No hay personal registrado para este servicio.
            </p>
          )}

          {/* New row inputs */}
          {adding && (
            <div className="flex gap-3 items-center py-3 mt-2 border-t border-dashed border-green-200 bg-green-50/40 rounded-lg px-2">
              <div className={colClass}>
                <Input className={inputCls} placeholder="Profesión" value={newRow.profesion}
                  onChange={(e) => setNewRow((r) => ({ ...r, profesion: e.target.value }))} />
              </div>
              <div className={colClass}>
                <Input className={inputCls} type="number" min={1} placeholder="Cant." value={newRow.cantidad}
                  onChange={(e) => setNewRow((r) => ({ ...r, cantidad: Number(e.target.value) }))} />
              </div>
              <div className={colClass}>
                <Input className={inputCls} placeholder="Disponibilidad" value={newRow.disponibilidad}
                  onChange={(e) => setNewRow((r) => ({ ...r, disponibilidad: e.target.value }))} />
              </div>
              <div className={colClass}>
                <Input className={inputCls} placeholder="Req. legal" value={newRow.requerimiento_legal}
                  onChange={(e) => setNewRow((r) => ({ ...r, requerimiento_legal: e.target.value }))} />
              </div>
              <div className="flex gap-1.5 w-[100px]">
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={createMut.isPending}
                  className="h-7 text-xs bg-green-500 hover:bg-green-600 text-white flex-1 disabled:opacity-60"
                >
                  {createMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "OK"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setAdding(false); setNewRow(EMPTY_ROW); }}
                  disabled={createMut.isPending}
                  className="h-7 text-xs flex-1"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
