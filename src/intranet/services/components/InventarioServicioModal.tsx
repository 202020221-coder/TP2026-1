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
// Tipos locales para Camiones (solo frontend — backend no soporta aún)
// ─────────────────────────────────────────────────────────────────────────────
interface CamionLocal {
  _localId: number;       // id temporal generado en frontend
  tipo: string;
  nombre: string;
  razon: string;
  estado: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Selector de catálogo de objetos
// ─────────────────────────────────────────────────────────────────────────────
function ObjetoSelector({
  items, isLoading, onSelect, onCancel,
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
              <span className="text-xs text-gray-400">stock: {item.cantidad}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                item.estado === "disponible" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>{item.estado}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Selector de catálogo de camiones
// ─────────────────────────────────────────────────────────────────────────────
function CamionSelector({
  camiones, isLoading, onSelect, onCancel,
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
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                cam.Estado === "Operacional" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>{cam.Estado}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fila nueva objeto
// ─────────────────────────────────────────────────────────────────────────────
function NuevoObjetoRow({
  item, onSave, onCancel, isSaving,
}: {
  item: CatalogoInventarioItem;
  onSave: (cantidad: number, estancia: string) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [cantidad, setCantidad] = useState("1");
  const [metodoTraslado, setMetodoTraslado] = useState(item.lugar_almacenaje || "");

  const handleSave = () => {
    const cant = parseInt(cantidad, 10);
    if (!cant || cant <= 0) { toast.error("La cantidad debe ser mayor a 0"); return; }
    onSave(cant, metodoTraslado);
  };

  return (
    <div className="flex gap-2 items-center py-3 mt-1 border-t border-dashed border-amber-200 bg-amber-50/40 rounded-lg px-2">
      <div className={col}><Input className={inputReadonly} value={item.nombre_objeto} readOnly tabIndex={-1} /></div>
      <div className={col}>
        <Input className={inputEditable} type="number" min={1} value={cantidad} autoFocus
          onChange={(e) => setCantidad(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }} />
      </div>
      <div className={col}>
        <Input className={inputEditable} value={metodoTraslado} placeholder="Método traslado..."
          onChange={(e) => setMetodoTraslado(e.target.value)} />
      </div>
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
// Fila edición objeto — state LOCAL por fila
// ─────────────────────────────────────────────────────────────────────────────
function EditObjetoRow({
  obj, onSave, onCancel, isSaving,
}: {
  obj: InventarioRequerido;
  onSave: (dto: UpdateInventarioRequeridoDTO) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [cantidad, setCantidad] = useState(String(obj.cantidad ?? 1));
  const [estancia, setEstancia] = useState(obj.estancia ?? "");

  const handleSave = () => {
    const cant = parseInt(cantidad, 10);
    if (!cant || cant <= 0) { toast.error("La cantidad debe ser mayor a 0"); return; }
    onSave({ cantidad: cant, estancia });
  };

  return (
    <div className="flex gap-2 items-center py-2 border-b border-gray-100">
      <div className={col}><Input className={inputReadonly} value={obj.nombre_objeto} readOnly tabIndex={-1} /></div>
      <div className={col}>
        <Input className={inputEditable} type="number" min={1} value={cantidad} autoFocus
          onChange={(e) => setCantidad(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }} />
      </div>
      <div className={col}>
        <Input className={inputEditable} value={estancia} placeholder="Método traslado..."
          onChange={(e) => setEstancia(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }} />
      </div>
      <div className="flex gap-1 w-[76px]">
        <Button size="sm" onClick={handleSave} disabled={isSaving}
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
// Fila nueva camión (solo local)
// ─────────────────────────────────────────────────────────────────────────────
function NuevoCamionRow({
  cam, onSave, onCancel,
}: {
  cam: CatalogoCamion;
  onSave: (tipo: string, razon: string) => void;
  onCancel: () => void;
}) {
  const [tipo, setTipo] = useState("");
  const [razon, setRazon] = useState("");
  return (
    <div className="flex gap-2 items-center py-3 mt-1 border-t border-dashed border-amber-200 bg-amber-50/40 rounded-lg px-2">
      <div className={col}>
        <Input className={inputEditable} value={tipo} placeholder="Tipo..." autoFocus
          onChange={(e) => setTipo(e.target.value)} />
      </div>
      <div className={col}><Input className={inputReadonly} value={cam.nombre} readOnly tabIndex={-1} /></div>
      <div className={col}>
        <Input className={inputEditable} value={razon} placeholder="Razón..."
          onChange={(e) => setRazon(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSave(tipo, razon); }} />
      </div>
      <div className={col}><Input className={inputReadonly} value={cam.Estado || "—"} readOnly tabIndex={-1} /></div>
      <div className="flex gap-1 w-[76px]">
        <Button size="sm" onClick={() => onSave(tipo, razon)}
          className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white flex-1">
          OK
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs flex-1">
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fila edición camión — state LOCAL
// ─────────────────────────────────────────────────────────────────────────────
function EditCamionRow({
  cam, onSave, onCancel,
}: {
  cam: CamionLocal;
  onSave: (tipo: string, razon: string) => void;
  onCancel: () => void;
}) {
  const [tipo, setTipo] = useState(cam.tipo);
  const [razon, setRazon] = useState(cam.razon);
  return (
    <div className="flex gap-2 items-center py-2 border-b border-gray-100">
      <div className={col}>
        <Input className={inputEditable} value={tipo} placeholder="Tipo..." autoFocus
          onChange={(e) => setTipo(e.target.value)} />
      </div>
      <div className={col}><Input className={inputReadonly} value={cam.nombre} readOnly tabIndex={-1} /></div>
      <div className={col}>
        <Input className={inputEditable} value={razon} placeholder="Razón..."
          onChange={(e) => setRazon(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSave(tipo, razon); }} />
      </div>
      <div className={col}><Input className={inputReadonly} value={cam.estado || "—"} readOnly tabIndex={-1} /></div>
      <div className="flex gap-1 w-[76px]">
        <Button size="sm" onClick={() => onSave(tipo, razon)}
          className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white flex-1">
          OK
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
function ObjetosSeccion({ servicio, items }: { servicio: Servicio; items: InventarioRequerido[] }) {
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
      toast.error(errData?.error ?? errData?.message ?? "Error al agregar objeto");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ idObjeto, dto }: { idObjeto: number; dto: UpdateInventarioRequeridoDTO }) =>
      updateInventarioRequerido(servicio.id, idObjeto, dto),
    onSuccess: async () => {
      toast.success("Objeto actualizado");
      await qc.invalidateQueries({ queryKey: key });
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const deleteMut = useMutation({
    mutationFn: (idObjeto: number) => deleteInventarioRequerido(servicio.id, idObjeto),
    onMutate: async (idObjeto) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<InventarioRequerido[]>(key);
      qc.setQueryData<InventarioRequerido[]>(key, (old = []) =>
        old.filter((o) => o.Id_Objeto !== idObjeto)
      );
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

  const [showSelector, setShowSelector] = useState(false);
  const [selected, setSelected] = useState<CatalogoInventarioItem | null>(null);
  const [editingIdObjeto, setEditingIdObjeto] = useState<number | null>(null);

  const handleSaveNuevo = async (cantidad: number, estancia: string) => {
    if (!selected) return;
    if (!selected.Id_Objeto || selected.Id_Objeto === 0) {
      toast.error("El objeto seleccionado no tiene un ID válido");
      return;
    }
    await createMut.mutateAsync({ Id_Objeto: selected.Id_Objeto, cantidad, estancia });
    setSelected(null);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Objetos</span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{items.length}</span>
        </div>
        <Button size="sm" disabled={showSelector || !!selected}
          onClick={() => { setShowSelector(true); setEditingIdObjeto(null); }}
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
      <div className="flex gap-2 mb-1 px-1 mt-2">
        {["Objetos", "Cantidad", "Método traslado"].map((h) => (
          <p key={h} className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
        ))}
        <div className="w-[76px]" />
      </div>

      {items.map((obj) =>
        editingIdObjeto === obj.Id_Objeto ? (
          <EditObjetoRow key={obj.Id_Objeto} obj={obj}
            onSave={(dto) => {
              updateMut.mutate(
                { idObjeto: obj.Id_Objeto, dto },
                { onSuccess: () => setEditingIdObjeto(null) }
              );
            }}
            onCancel={() => setEditingIdObjeto(null)}
            isSaving={updateMut.isPending && updateMut.variables?.idObjeto === obj.Id_Objeto}
          />
        ) : (
          <div key={obj.Id_Objeto} className="flex gap-2 items-center py-2 border-b border-gray-100 last:border-0">
            <p className="flex-1 text-sm text-gray-800">{obj.nombre_objeto}</p>
            <p className="flex-1 text-sm text-gray-600">{obj.cantidad}</p>
            <p className="flex-1 text-sm text-gray-600">{obj.estancia || "—"}</p>
            <div className="flex gap-1 w-[76px]">
              <Button size="sm" variant="outline"
                onClick={() => setEditingIdObjeto(obj.Id_Objeto)}
                className="h-7 text-xs border-amber-300 text-amber-600 hover:bg-amber-50 flex-1">
                <Pencil className="w-3 h-3" />
              </Button>
              <Button size="sm"
                onClick={() => deleteMut.mutate(obj.Id_Objeto)}
                disabled={deleteMut.isPending && deleteMut.variables === obj.Id_Objeto}
                className="h-7 text-xs bg-red-500 hover:bg-red-600 text-white flex-1 disabled:opacity-60">
                {deleteMut.isPending && deleteMut.variables === obj.Id_Objeto
                  ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        )
      )}

      {items.length === 0 && !selected && !showSelector && (
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
// Sección Camiones — solo frontend (backend no soporta aún)
// ─────────────────────────────────────────────────────────────────────────────
function CamionesSeccion() {
  const { data: catalogoCam = [], isLoading: loadingCat } = useQuery({
    queryKey: ["catalogo-camiones"],
    queryFn: getCatalogoCamiones,
    staleTime: 5 * 60 * 1000,
  });

  const [camiones, setCamiones] = useState<CamionLocal[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selected, setSelected] = useState<CatalogoCamion | null>(null);
  const [editingLocalId, setEditingLocalId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);

  const handleSaveNuevo = (tipo: string, razon: string) => {
    if (!selected) return;
    setCamiones((prev) => [
      ...prev,
      { _localId: nextId, tipo, nombre: selected.nombre, razon, estado: selected.Estado },
    ]);
    setNextId((n) => n + 1);
    setSelected(null);
  };

  const handleSaveEdit = (localId: number, tipo: string, razon: string) => {
    setCamiones((prev) =>
      prev.map((c) => c._localId === localId ? { ...c, tipo, razon } : c)
    );
    setEditingLocalId(null);
  };

  const handleDelete = (localId: number) => {
    setCamiones((prev) => prev.filter((c) => c._localId !== localId));
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
          onClick={() => { setShowSelector(true); setEditingLocalId(null); }}
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
      <div className="flex gap-2 mb-1 px-1 mt-2">
        {["Tipo", "Nombre", "Razón", "Estado"].map((h) => (
          <p key={h} className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
        ))}
        <div className="w-[76px]" />
      </div>

      {camiones.map((cam) =>
        editingLocalId === cam._localId ? (
          <EditCamionRow key={cam._localId} cam={cam}
            onSave={(tipo, razon) => handleSaveEdit(cam._localId, tipo, razon)}
            onCancel={() => setEditingLocalId(null)} />
        ) : (
          <div key={cam._localId} className="flex gap-2 items-center py-2 border-b border-gray-100 last:border-0">
            <p className="flex-1 text-sm text-gray-800">{cam.tipo || "—"}</p>
            <p className="flex-1 text-sm text-gray-600">{cam.nombre}</p>
            <p className="flex-1 text-sm text-gray-600">{cam.razon || "—"}</p>
            <p className="flex-1 text-sm text-gray-600">{cam.estado || "—"}</p>
            <div className="flex gap-1 w-[76px]">
              <Button size="sm" variant="outline"
                onClick={() => setEditingLocalId(cam._localId)}
                className="h-7 text-xs border-amber-300 text-amber-600 hover:bg-amber-50 flex-1">
                <Pencil className="w-3 h-3" />
              </Button>
              <Button size="sm"
                onClick={() => handleDelete(cam._localId)}
                className="h-7 text-xs bg-red-500 hover:bg-red-600 text-white flex-1">
                <Trash2 className="w-3 h-3" />
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
          onCancel={() => setSelected(null)} />
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">ID {servicio.id}</p>
            <h2 className="text-base font-semibold text-gray-800">{servicio.nombre}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Inventario de Servicio</p>
          </div>
          <Button size="sm" onClick={onClose} variant="outline" className="h-8 text-xs">Cerrar</Button>
        </div>

        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            </div>
          ) : (
            <>
              <ObjetosSeccion servicio={servicio} items={items} />
              <div className="border-t border-gray-100" />
              <CamionesSeccion />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
