import { useState, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Loader2, X, Box, Truck, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import type {
  Servicio,
  InventarioRequerido,
  UpdateInventarioRequeridoDTO,
} from "../interfaces/service";
import {
  getInventarioRequerido,
  createObjetoRequerido,
  createCamionRequerido,
  updateInventarioRequerido,
  deleteInventarioRequerido,
  getCatalogoInventario,
  getCatalogoCamiones,
  type CatalogoInventarioItem,
  type CatalogoCamion,
} from "../api/inventario.api";

// ─── Estilos ──────────────────────────────────────────────────────────────────
const inputEditable =
  "h-8 text-sm bg-amber-50 border-amber-200 focus:border-amber-400 focus-visible:ring-amber-300";
const inputReadonly =
  "h-8 text-sm bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed";
const col = "flex-1 min-w-0";

// ─────────────────────────────────────────────────────────────────────────────
// Selector genérico de catálogo
// ─────────────────────────────────────────────────────────────────────────────

function ObjetoSelector({
  items,
  isLoading,
  onSelect,
  onCancel,
}: {
  items: CatalogoInventarioItem[];
  isLoading: boolean;
  onSelect: (i: CatalogoInventarioItem) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState("");
  const filtered = items.filter((i) =>
    i.nombre_objeto.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="my-2 border border-dashed border-amber-200 bg-amber-50/30 rounded-lg p-3">
      <div className="flex gap-2 mb-2">
        <Input className="h-7 text-xs flex-1" placeholder="Buscar objeto..." value={q}
          onChange={(e) => setQ(e.target.value)} autoFocus />
        <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">
          <X className="w-3 h-3" />
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-amber-400" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-xs py-3">Sin resultados.</p>
      ) : (
        <div className="max-h-44 overflow-y-auto space-y-1">
          {filtered.map((item) => (
            <button key={item.Id_Objeto} onClick={() => onSelect(item)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-amber-100 transition-colors">
              <Box className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="flex-1 text-sm font-medium text-gray-800">{item.nombre_objeto}</span>
              <span className="text-xs text-gray-400">x{item.cantidad}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${item.estado === "disponible" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {item.estado}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CamionSelector({
  camiones,
  isLoading,
  onSelect,
  onCancel,
}: {
  camiones: CatalogoCamion[];
  isLoading: boolean;
  onSelect: (c: CatalogoCamion) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState("");
  const filtered = camiones.filter((c) =>
    c.nombre.toLowerCase().includes(q.toLowerCase()) ||
    c.Placa.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="my-2 border border-dashed border-amber-200 bg-amber-50/30 rounded-lg p-3">
      <div className="flex gap-2 mb-2">
        <Input className="h-7 text-xs flex-1" placeholder="Buscar por nombre o placa..." value={q}
          onChange={(e) => setQ(e.target.value)} autoFocus />
        <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">
          <X className="w-3 h-3" />
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-amber-400" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-xs py-3">Sin resultados.</p>
      ) : (
        <div className="max-h-44 overflow-y-auto space-y-1">
          {filtered.map((cam) => (
            <button key={cam.Placa} onClick={() => onSelect(cam)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-amber-100 transition-colors">
              <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="flex-1 text-sm font-medium text-gray-800">{cam.nombre}</span>
              <span className="text-xs text-gray-400">{cam.Placa}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${cam.Estado === "Operacional" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {cam.Estado}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fila nueva objeto (campos readonly pre-llenados, solo razón editable)
// ─────────────────────────────────────────────────────────────────────────────
function NuevoObjetoRow({
  item, onSave, onCancel, isSaving,
}: {
  item: CatalogoInventarioItem;
  // cantidad_objeto = cuántas unidades necesita el servicio (ingresado por el usuario)
  onSave: (cantidad: number, razon: string) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [cantidad, setCantidad] = useState("1");
  const [razon, setRazon] = useState("");

  const handleSave = () => {
    const cant = parseInt(cantidad, 10);
    if (!cant || cant <= 0) return;
    onSave(cant, razon);
  };

  return (
    <div className="flex gap-3 items-center py-3 mt-1 border-t border-dashed border-amber-200 bg-amber-50/40 rounded-lg px-2">
      <div className={col}><Input className={inputReadonly} value={item.nombre_objeto} readOnly tabIndex={-1} /></div>
      {/* ✅ cantidad_objeto editable — el usuario define cuántas unidades requiere el servicio */}
      <div className={col}>
        <Input
          className={inputEditable}
          type="number"
          min={1}
          value={cantidad}
          autoFocus
          onChange={(e) => setCantidad(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
        />
      </div>
      <div className={col}><Input className={inputReadonly} value={item.lugar_almacenaje || "—"} readOnly tabIndex={-1} /></div>
      <div className={col}>
        <Input className={inputEditable} value={razon} placeholder="Razón..."
          onChange={(e) => setRazon(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }} />
      </div>
      <div className={col}><Input className={inputReadonly} value={item.estado || "—"} readOnly tabIndex={-1} /></div>
      <div className="flex gap-1 w-[76px]">
        <Button size="sm" onClick={handleSave}
          disabled={isSaving || !cantidad || parseInt(cantidad) <= 0}
          className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white flex-1 disabled:opacity-60">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : "OK"}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} disabled={isSaving} className="h-7 text-xs flex-1">
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fila nueva camión (nombre y estado readonly, tipo y razón editables)
// ─────────────────────────────────────────────────────────────────────────────
function NuevoCamionRow({
  cam, onSave, onCancel, isSaving,
}: {
  cam: CatalogoCamion;
  onSave: (tipo: string, razon: string) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [tipo, setTipo] = useState("");
  const [razon, setRazon] = useState("");
  return (
    <div className="flex gap-3 items-center py-3 mt-1 border-t border-dashed border-amber-200 bg-amber-50/40 rounded-lg px-2">
      <div className={col}>
        <Input className={inputEditable} value={tipo} placeholder="Tipo..." autoFocus
          onChange={(e) => setTipo(e.target.value)} />
      </div>
      <div className={col}><Input className={inputReadonly} value={cam.nombre} readOnly tabIndex={-1} /></div>
      <div className={col}>
        <Input className={inputEditable} value={razon} placeholder="Razón..."
          onChange={(e) => setRazon(e.target.value)} />
      </div>
      <div className={col}><Input className={inputReadonly} value={cam.Estado || "—"} readOnly tabIndex={-1} /></div>
      <div className="flex gap-1 w-[76px]">
        <Button size="sm" onClick={() => onSave(tipo, razon)} disabled={isSaving}
          className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white flex-1 disabled:opacity-60">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : "OK"}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} disabled={isSaving} className="h-7 text-xs flex-1">
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX: Fila de edición de objeto con state LOCAL (evita duplicación de razón)
// ─────────────────────────────────────────────────────────────────────────────
function EditObjetoRow({
  obj,
  onSave,
  onCancel,
  isSaving,
}: {
  obj: InventarioRequerido;
  onSave: (razon: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  // ✅ Estado LOCAL a esta fila — no se comparte con otras filas
  const [razon, setRazon] = useState(obj.razon ?? "");
  return (
    <div className="flex gap-3 items-center py-2 border-b border-gray-100">
      <div className={col}><Input className={inputReadonly} value={obj.nombre_objeto} readOnly tabIndex={-1} /></div>
      <div className={col}><Input className={inputReadonly} value={String(obj.cantidad)} readOnly tabIndex={-1} /></div>
      <div className={col}><Input className={inputReadonly} value={obj.metodo_traslado || "—"} readOnly tabIndex={-1} /></div>
      <div className={col}>
        <Input
          className={inputEditable}
          value={razon}
          placeholder="Razón..."
          autoFocus
          onChange={(e) => setRazon(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSave(razon); }}
        />
      </div>
      <div className={col}><Input className={inputReadonly} value={obj.estado || "—"} readOnly tabIndex={-1} /></div>
      <div className="flex gap-1 w-[76px]">
        <Button size="sm" onClick={() => onSave(razon)} disabled={isSaving}
          className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white flex-1">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : "OK"}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX: Fila de edición de camión con state LOCAL
// ─────────────────────────────────────────────────────────────────────────────
function EditCamionRow({
  cam,
  onSave,
  onCancel,
  isSaving,
}: {
  cam: InventarioRequerido;
  onSave: (tipo: string, razon: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  // ✅ Estado LOCAL a esta fila
  const [tipo, setTipo] = useState(cam.tipo_camion ?? "");
  const [razon, setRazon] = useState(cam.razon ?? "");
  return (
    <div className="flex gap-3 items-center py-2 border-b border-gray-100">
      <div className={col}>
        <Input className={inputEditable} value={tipo} placeholder="Tipo..." autoFocus
          onChange={(e) => setTipo(e.target.value)} />
      </div>
      <div className={col}><Input className={inputReadonly} value={cam.nombre_camion} readOnly tabIndex={-1} /></div>
      <div className={col}>
        <Input className={inputEditable} value={razon} placeholder="Razón..."
          onChange={(e) => setRazon(e.target.value)} />
      </div>
      <div className={col}><Input className={inputReadonly} value={cam.estado_camion || "—"} readOnly tabIndex={-1} /></div>
      <div className="flex gap-1 w-[76px]">
        <Button size="sm" onClick={() => onSave(tipo, razon)} disabled={isSaving}
          className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white flex-1">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : "OK"}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección Objetos
// ─────────────────────────────────────────────────────────────────────────────
function ObjetosSeccion({
  servicio, items,
}: { servicio: Servicio; items: InventarioRequerido[] }) {
  const qc = useQueryClient();
  const key = ["inventario-requerido", servicio.id];

  const { data: catalogo = [], isLoading: loadingCat } = useQuery({
    queryKey: ["catalogo-inventario"],
    queryFn: getCatalogoInventario,
    staleTime: 5 * 60 * 1000,
  });

  const createMut = useMutation({
    mutationFn: (dto: Parameters<typeof createObjetoRequerido>[1]) =>
      createObjetoRequerido(servicio.id, dto),
    onSuccess: async () => {
      toast.success("Objeto agregado");
      await qc.invalidateQueries({ queryKey: key });
    },
    onError: (err: unknown) => {
      const errData = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      const msg = errData?.error ?? errData?.message;
      toast.error(msg ?? "Error al agregar objeto");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateInventarioRequeridoDTO }) =>
      updateInventarioRequerido(servicio.id, id, dto),
    onSuccess: async () => {
      toast.success("Objeto actualizado");
      await qc.invalidateQueries({ queryKey: key });
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteInventarioRequerido(servicio.id, id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<InventarioRequerido[]>(key);
      qc.setQueryData<InventarioRequerido[]>(key, (old = []) => old.filter((o) => o.id !== id));
      return { prev };
    },
    onSuccess: async () => {
      toast.success("Objeto eliminado");
      await qc.invalidateQueries({ queryKey: key });
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
      toast.error("Error al eliminar");
    },
  });

  const objetos = items.filter((i) => i.tipo === "objeto");
  const [showSelector, setShowSelector] = useState(false);
  const [selected, setSelected] = useState<CatalogoInventarioItem | null>(null);
  // ✅ Solo guardamos QUÉ fila está en modo edición, no su contenido
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSaveNuevo = async (cantidad: number, razon: string) => {
    if (!selected) return;
    if (!selected.Id_Objeto || selected.Id_Objeto === 0) {
      toast.error("El objeto seleccionado no tiene un ID válido");
      return;
    }
    await createMut.mutateAsync({
      Id_Objeto: selected.Id_Objeto,
      cantidad_objeto: cantidad,   // ✅ valor que el usuario ingresó, siempre > 0
      metodo_traslado: selected.lugar_almacenaje,
      estado: selected.estado,
      razon,
    });
    setSelected(null);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Objetos</span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{objetos.length}</span>
        </div>
        <Button size="sm" disabled={showSelector || !!selected}
          onClick={() => { setShowSelector(true); setEditingId(null); }}
          className="bg-amber-500 hover:bg-amber-600 text-white gap-1 h-7 text-xs disabled:opacity-50">
          <Plus className="w-3.5 h-3.5" /> Agregar
        </Button>
      </div>

      {showSelector && (
        <ObjetoSelector items={catalogo} isLoading={loadingCat}
          onSelect={(i) => { setSelected(i); setShowSelector(false); }}
          onCancel={() => setShowSelector(false)} />
      )}

      {/* Headers */}
      <div className="flex gap-3 mb-1 px-1 mt-2">
        {["Objetos", "Cantidad", "Método traslado", "Razón", "Estado"].map((h) => (
          <p key={h} className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
        ))}
        <div className="w-[76px]" />
      </div>

      {objetos.map((obj) =>
        editingId === obj.id ? (
          // ✅ Componente separado con state propio — sin duplicación de razón
          <EditObjetoRow
            key={obj.id}
            obj={obj}
            onSave={(razon) => {
              updateMut.mutate(
                { id: obj.id, dto: { razon } },
                { onSuccess: () => setEditingId(null) }
              );
            }}
            onCancel={() => setEditingId(null)}
            isSaving={updateMut.isPending && updateMut.variables?.id === obj.id}
          />
        ) : (
          <div key={obj.id} className="flex gap-3 items-center py-2 border-b border-gray-100 last:border-0">
            <p className="flex-1 text-sm text-gray-800">{obj.nombre_objeto}</p>
            <p className="flex-1 text-sm text-gray-600">{obj.cantidad}</p>
            <p className="flex-1 text-sm text-gray-600">{obj.metodo_traslado || "—"}</p>
            <p className="flex-1 text-sm text-gray-600">{obj.razon || "—"}</p>
            <p className="flex-1 text-sm text-gray-600">{obj.estado || "—"}</p>
            <div className="flex gap-1 w-[76px]">
              <Button size="sm" variant="outline"
                onClick={() => setEditingId(obj.id)}
                className="h-7 text-xs border-amber-300 text-amber-600 hover:bg-amber-50 flex-1">
                <Pencil className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  // ✅ Log debug para verificar el id que se usa en DELETE
                  console.log("[DELETE objeto] id:", obj.id, "| raw obj:", obj);
                  deleteMut.mutate(obj.id);
                }}
                disabled={deleteMut.isPending && deleteMut.variables === obj.id}
                className="h-7 text-xs bg-red-500 hover:bg-red-600 text-white flex-1 disabled:opacity-60">
                {deleteMut.isPending && deleteMut.variables === obj.id
                  ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        )
      )}

      {objetos.length === 0 && !selected && !showSelector && (
        <p className="text-center text-gray-400 text-sm py-5">
          Sin objetos. Usa "Agregar" para seleccionar del inventario.
        </p>
      )}

      {selected && (
        <NuevoObjetoRow item={selected} onSave={handleSaveNuevo}
          onCancel={() => setSelected(null)} isSaving={createMut.isPending} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección Camiones
// ─────────────────────────────────────────────────────────────────────────────
function CamionesSeccion({
  servicio, items,
}: { servicio: Servicio; items: InventarioRequerido[] }) {
  const qc = useQueryClient();
  const key = ["inventario-requerido", servicio.id];

  const { data: catalogoCam = [], isLoading: loadingCat } = useQuery({
    queryKey: ["catalogo-camiones"],
    queryFn: getCatalogoCamiones,
    staleTime: 5 * 60 * 1000,
  });

  const createMut = useMutation({
    mutationFn: (dto: Parameters<typeof createCamionRequerido>[1]) =>
      createCamionRequerido(servicio.id, dto),
    onSuccess: async () => {
      toast.success("Camión agregado");
      await qc.invalidateQueries({ queryKey: key });
    },
    onError: (err: unknown) => {
      const errData = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      const msg = errData?.error ?? errData?.message;
      toast.error(msg ?? "Error al agregar camión");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateInventarioRequeridoDTO }) =>
      updateInventarioRequerido(servicio.id, id, dto),
    onSuccess: async () => {
      toast.success("Camión actualizado");
      await qc.invalidateQueries({ queryKey: key });
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteInventarioRequerido(servicio.id, id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<InventarioRequerido[]>(key);
      qc.setQueryData<InventarioRequerido[]>(key, (old = []) => old.filter((c) => c.id !== id));
      return { prev };
    },
    onSuccess: async () => {
      toast.success("Camión eliminado");
      await qc.invalidateQueries({ queryKey: key });
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
      toast.error("Error al eliminar");
    },
  });

  const camiones = items.filter((i) => i.tipo === "camion");
  const [showSelector, setShowSelector] = useState(false);
  const [selected, setSelected] = useState<CatalogoCamion | null>(null);
  // ✅ Solo guardamos qué fila está en modo edición
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSaveNuevo = async (tipo: string, razon: string) => {
    if (!selected) return;
    // Validar Placa antes de enviar
    if (!selected.Placa) {
      toast.error("El camión seleccionado no tiene placa");
      return;
    }
    await createMut.mutateAsync({ Placa: selected.Placa, tipo_camion: tipo, razon });
    setSelected(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Camiones</span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{camiones.length}</span>
        </div>
        <Button size="sm" disabled={showSelector || !!selected}
          onClick={() => { setShowSelector(true); setEditingId(null); }}
          className="bg-amber-500 hover:bg-amber-600 text-white gap-1 h-7 text-xs disabled:opacity-50">
          <Plus className="w-3.5 h-3.5" /> Agregar
        </Button>
      </div>

      {showSelector && (
        <CamionSelector camiones={catalogoCam} isLoading={loadingCat}
          onSelect={(c) => { setSelected(c); setShowSelector(false); }}
          onCancel={() => setShowSelector(false)} />
      )}

      {/* Headers */}
      <div className="flex gap-3 mb-1 px-1 mt-2">
        {["Tipo", "Nombre", "Razón", "Estado"].map((h) => (
          <p key={h} className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
        ))}
        <div className="w-[76px]" />
      </div>

      {camiones.map((cam) =>
        editingId === cam.id ? (
          // ✅ Componente separado con state propio
          <EditCamionRow
            key={cam.id}
            cam={cam}
            onSave={(tipo, razon) => {
              updateMut.mutate(
                { id: cam.id, dto: { tipo_camion: tipo, razon } },
                { onSuccess: () => setEditingId(null) }
              );
            }}
            onCancel={() => setEditingId(null)}
            isSaving={updateMut.isPending && updateMut.variables?.id === cam.id}
          />
        ) : (
          <div key={cam.id} className="flex gap-3 items-center py-2 border-b border-gray-100 last:border-0">
            <p className="flex-1 text-sm text-gray-800">{cam.tipo_camion || "—"}</p>
            <p className="flex-1 text-sm text-gray-600">{cam.nombre_camion}</p>
            <p className="flex-1 text-sm text-gray-600">{cam.razon || "—"}</p>
            <p className="flex-1 text-sm text-gray-600">{cam.estado_camion || "—"}</p>
            <div className="flex gap-1 w-[76px]">
              <Button size="sm" variant="outline"
                onClick={() => setEditingId(cam.id)}
                className="h-7 text-xs border-amber-300 text-amber-600 hover:bg-amber-50 flex-1">
                <Pencil className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  console.log("[DELETE camión] id:", cam.id, "| raw cam:", cam);
                  deleteMut.mutate(cam.id);
                }}
                disabled={deleteMut.isPending && deleteMut.variables === cam.id}
                className="h-7 text-xs bg-red-500 hover:bg-red-600 text-white flex-1 disabled:opacity-60">
                {deleteMut.isPending && deleteMut.variables === cam.id
                  ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        )
      )}

      {camiones.length === 0 && !selected && !showSelector && (
        <p className="text-center text-gray-400 text-sm py-5">
          Sin camiones. Usa "Agregar" para seleccionar del catálogo.
        </p>
      )}

      {selected && (
        <NuevoCamionRow cam={selected} onSave={handleSaveNuevo}
          onCancel={() => setSelected(null)} isSaving={createMut.isPending} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal principal
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  servicio: Servicio;
  onClose: () => void;
}

export const InventarioServicioModal: FC<Props> = ({ servicio, onClose }) => {
  const key = ["inventario-requerido", servicio.id];
  const { data: items = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: () => getInventarioRequerido(servicio.id),
    staleTime: 0,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">ID {servicio.id}</p>
            <h2 className="text-base font-semibold text-gray-800">{servicio.nombre}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Inventario de Servicio</p>
          </div>
          <Button size="sm" onClick={onClose} variant="outline" className="h-8 text-xs">Cerrar</Button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            </div>
          ) : (
            <>
              <ObjetosSeccion servicio={servicio} items={items} />
              <div className="border-t border-gray-100" />
              <CamionesSeccion servicio={servicio} items={items} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
