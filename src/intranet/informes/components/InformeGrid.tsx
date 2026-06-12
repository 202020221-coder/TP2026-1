import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  type ColDef,
  type ICellRendererParams,
  type GridReadyEvent,
  type GridApi,
  ModuleRegistry,
} from "ag-grid-community";
import { Button } from "@/shared/components/ui/button";
import {
  Save,
  Trash2,
  Upload,
  ImageIcon,
  Loader2,
  Plus,
  Pencil,
  X,
} from "lucide-react";
import type {
  InformeRowData,
  ProyectoEtapa,
  ProyectoActividad,
  IncidenciaResumen,
} from "../interfaces/informe";
import {
  createInforme,
  updateInforme,
  deleteInforme,
  uploadEvidencia,
  getEvidenciaUrl,
  getEvidenciaStaticUrl,
} from "../api/informe.api";
import type { Informe } from "../interfaces/informe";
import { toast } from "sonner";

ModuleRegistry.registerModules([AllCommunityModule]);

interface InformeGridProps {
  idProyecto: number;
  informes: Informe[];
  etapas: ProyectoEtapa[];
  incidencias: IncidenciaResumen[];
  fecha: string;
  onRefresh: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

let newRowCounter = -1;

function informeToRow(inf: Informe): InformeRowData {
  return {
    id: inf.id,
    fecha: inf.fecha?.slice(0, 10) ?? "",
    hora: inf.hora?.slice(0, 5) ?? "",
    descripcion: inf.descripcion ?? "",
    id_incidencia: inf.id_incidencia,
    id_proyecto_etapa: inf.id_proyecto_etapa,
    id_proyecto_actividad: inf.id_proyecto_actividad,
    evidenciaFile: null,
    evidenciaUrl: inf.evidencia,
    isNew: false,
    isSaving: false,
  };
}

function formatFechaDisplay(fecha: string): string {
  if (!fecha) return "";
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}

function getActividadesForEtapa(
  etapas: ProyectoEtapa[],
  etapaId: number | null,
): ProyectoActividad[] {
  if (!etapaId) return [];
  const etapa = etapas.find((e) => e.id === etapaId);
  return etapa?.actividades ?? [];
}

// ── Cell Renderer Components (proper React components for hooks support) ─────

/** Foto cell — uses useRef so must be a real component */
function FotoCellRenderer(
  props: ICellRendererParams<InformeRowData> & {
    idProyecto: number;
    onUpdateRowData: (id: number, fields: Partial<InformeRowData>) => void;
  },
) {
  const { data, idProyecto, onUpdateRowData } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!data) return null;

  const [file, setFile] = useState<File | null>(data.evidenciaFile);
  const [url, setUrl] = useState<string | null>(data.evidenciaUrl);

  useEffect(() => {
    setFile(data.evidenciaFile);
    setUrl(data.evidenciaUrl);
  }, [data.evidenciaFile, data.evidenciaUrl]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!["image/png", "image/jpeg"].includes(selectedFile.type)) {
      toast.error("Solo se permiten archivos PNG o JPEG");
      return;
    }

    if (!data.isNew && data.id > 0) {
      // Existing row: upload immediately
      try {
        toast.loading("Subiendo evidencia...");
        const res = await uploadEvidencia(idProyecto, data.id, selectedFile);
        setFile(null);
        setUrl(res.url);
        onUpdateRowData(data.id, {
          evidenciaUrl: res.url,
          evidenciaFile: null,
        });
        toast.dismiss();
        toast.success("Evidencia actualizada correctamente");
      } catch (err) {
        toast.dismiss();
        console.error("Error uploading evidence:", err);
        toast.error("Error al subir la evidencia");
      }
    } else {
      // New row: store locally
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setUrl(objectUrl);
      onUpdateRowData(data.id, {
        evidenciaFile: selectedFile,
        evidenciaUrl: objectUrl,
      });
    }
  };

  const hasEvidence = url || file;

  const getHref = () => {
    if (!url) return "";
    if (url.startsWith("blob:")) return url;
    if (url.startsWith("/uploads")) return getEvidenciaStaticUrl(url);
    return getEvidenciaUrl(idProyecto, data.id);
  };

  const isEditable = data.isNew || data.isEditing;

  return (
    <div className="flex items-center gap-2 h-full">
      {isEditable && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs font-medium"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-3 h-3 mr-1" />
            {hasEvidence ? "Cambiar" : "Subir"}
          </Button>
        </>
      )}
      {url && (
        <a
          href={getHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-primary transition-colors"
          title="Ver evidencia"
        >
          <ImageIcon className="w-4 h-4" />
        </a>
      )}
      {isEditable && file && (
        <span className="text-[10px] text-emerald-600 font-medium truncate max-w-[60px]" title={file.name}>
          {file.name}
        </span>
      )}
    </div>
  );
}

/** Horario cell with date and time inputs */
function HorarioCellRenderer(
  props: ICellRendererParams<InformeRowData> & {
    onUpdateRowData: (id: number, fields: Partial<InformeRowData>) => void;
  },
) {
  const { data, onUpdateRowData } = props;
  if (!data) return null;

  const [fecha, setFecha] = useState(data.fecha);
  const [hora, setHora] = useState(data.hora);

  useEffect(() => {
    setFecha(data.fecha);
    setHora(data.hora);
  }, [data.fecha, data.hora]);

  const isEditable = data.isNew || data.isEditing;

  if (isEditable) {
    return (
      <div className="flex items-center gap-1.5 h-full">
        <input
          type="date"
          className="bg-transparent border border-border/50 rounded px-1.5 py-0.5 text-xs outline-none focus:ring-1 focus:ring-ring w-[120px]"
          value={fecha}
          onChange={(e) => {
            const val = e.target.value;
            setFecha(val);
            onUpdateRowData(data.id, { fecha: val });
          }}
        />
        <input
          type="time"
          className="bg-transparent border border-border/50 rounded px-1.5 py-0.5 text-xs outline-none focus:ring-1 focus:ring-ring w-[80px]"
          value={hora}
          onChange={(e) => {
            const val = e.target.value;
            setHora(val);
            onUpdateRowData(data.id, { hora: val });
          }}
        />
      </div>
    );
  }
  return (
    <span className="text-sm">
      {formatFechaDisplay(data.fecha)} {data.hora}
    </span>
  );
}

/** Ocurrencia cell with text input */
function OcurrenciaCellRenderer(
  props: ICellRendererParams<InformeRowData> & {
    onUpdateRowData: (id: number, fields: Partial<InformeRowData>) => void;
  },
) {
  const { data, onUpdateRowData } = props;
  if (!data) return null;

  const [desc, setDesc] = useState(data.descripcion);

  useEffect(() => {
    setDesc(data.descripcion);
  }, [data.descripcion]);

  const isEditable = data.isNew || data.isEditing;

  if (isEditable) {
    return (
      <input
        type="text"
        className="w-full h-full bg-transparent border-none outline-none text-sm"
        placeholder="Descripción del suceso..."
        value={desc}
        onChange={(e) => {
          const val = e.target.value;
          setDesc(val);
          onUpdateRowData(data.id, { descripcion: val });
        }}
      />
    );
  }
  return <span>{data.descripcion || "—"}</span>;
}

/** Incidencia cell selector */
function IncidenciaCellRenderer(
  props: ICellRendererParams<InformeRowData> & {
    incidencias: IncidenciaResumen[];
    onUpdateRowData: (id: number, fields: Partial<InformeRowData>) => void;
  },
) {
  const { data, incidencias, onUpdateRowData } = props;
  if (!data) return null;

  const [selected, setSelected] = useState(data.id_incidencia);

  useEffect(() => {
    setSelected(data.id_incidencia);
  }, [data.id_incidencia]);

  const isEditable = data.isNew || data.isEditing;

  if (!isEditable) {
    const inc = incidencias.find((i) => i.id_incidencia === data.id_incidencia);
    return (
      <span>
        {inc
          ? inc.nombre_incidencia ?? `Incidencia ${inc.id_incidencia}`
          : "Ninguno"}
      </span>
    );
  }

  return (
    <select
      className="w-full h-full bg-transparent border-none outline-none text-sm px-1 cursor-pointer"
      value={selected ?? ""}
      onChange={(e) => {
        const val = e.target.value === "" ? null : Number(e.target.value);
        setSelected(val);
        onUpdateRowData(data.id, { id_incidencia: val });
      }}
    >
      <option value="">Ninguno</option>
      {incidencias.map((inc) => (
        <option key={inc.id_incidencia} value={inc.id_incidencia}>
          {inc.nombre_incidencia ?? `Incidencia ${inc.id_incidencia}`}
        </option>
      ))}
    </select>
  );
}

/** Etapa cell selector */
function EtapaCellRenderer(
  props: ICellRendererParams<InformeRowData> & {
    etapas: ProyectoEtapa[];
    onUpdateRowData: (id: number, fields: Partial<InformeRowData>) => void;
  },
) {
  const { data, etapas, onUpdateRowData } = props;
  if (!data) return null;

  const [selected, setSelected] = useState(data.id_proyecto_etapa);

  useEffect(() => {
    setSelected(data.id_proyecto_etapa);
  }, [data.id_proyecto_etapa]);

  const isEditable = data.isNew || data.isEditing;

  if (!isEditable) {
    const et = etapas.find((e) => e.id === data.id_proyecto_etapa);
    return <span>{et?.nombre ?? "—"}</span>;
  }

  return (
    <select
      className="w-full h-full bg-transparent border-none outline-none text-sm px-1 cursor-pointer"
      value={selected ?? ""}
      onChange={(e) => {
        const val = e.target.value === "" ? null : Number(e.target.value);
        setSelected(val);
        onUpdateRowData(data.id, {
          id_proyecto_etapa: val,
          id_proyecto_actividad: null,
        });
      }}
    >
      <option value="">— Sin etapa —</option>
      {etapas
        .filter((et) => et.tipo === "cotizacion")
        .map((et) => (
          <option key={et.id} value={et.id}>
            {et.nombre}
          </option>
        ))}
    </select>
  );
}

/** Actividad cell selector */
function ActividadCellRenderer(
  props: ICellRendererParams<InformeRowData> & {
    etapas: ProyectoEtapa[];
    onUpdateRowData: (id: number, fields: Partial<InformeRowData>) => void;
  },
) {
  const { data, etapas, onUpdateRowData } = props;
  if (!data) return null;

  const [selected, setSelected] = useState(data.id_proyecto_actividad);

  useEffect(() => {
    setSelected(data.id_proyecto_actividad);
  }, [data.id_proyecto_actividad]);

  const isEditable = data.isNew || data.isEditing;

  if (!isEditable) {
    const acts = etapas.flatMap((e) => e.actividades);
    const act = acts.find((a) => a.id === data.id_proyecto_actividad);
    return <span>{act?.nombre ?? "—"}</span>;
  }

  const actividades = getActividadesForEtapa(etapas, data.id_proyecto_etapa);

  return (
    <select
      className="w-full h-full bg-transparent border-none outline-none text-sm px-1 cursor-pointer"
      value={selected ?? ""}
      disabled={!data.id_proyecto_etapa}
      onChange={(e) => {
        const val = e.target.value === "" ? null : Number(e.target.value);
        setSelected(val);
        onUpdateRowData(data.id, {
          id_proyecto_actividad: val,
        });
      }}
    >
      <option value="">— Sin actividad —</option>
      {actividades.map((act) => (
        <option key={act.id} value={act.id}>
          {act.nombre}
        </option>
      ))}
    </select>
  );
}

/** Actions cell — uses useState so must be a real component */
function ActionsCellRenderer(
  props: ICellRendererParams<InformeRowData> & {
    idProyecto: number;
    onRefresh: () => void;
    onRemoveNewRow: (id: number) => void;
    onToggleEdit: (id: number, editing: boolean) => void;
  },
) {
  const data = props.data;
  const [saving, setSaving] = useState(false);

  if (!data) return null;

  const handleSave = async () => {
    const latestData = props.node.data;
    if (!latestData) return;
    if (!latestData.fecha) {
      toast.error("La fecha es obligatoria");
      return;
    }
    if (!latestData.hora) {
      toast.error("La hora es obligatoria");
      return;
    }
    setSaving(true);
    try {
      const body = {
        fecha: latestData.fecha,
        hora: latestData.hora.length === 5 ? `${latestData.hora}:00` : latestData.hora,
        descripcion: latestData.descripcion || undefined,
        relacion: latestData.id_incidencia ? String(latestData.id_incidencia) : "ninguna",
        id_proyecto_etapa: latestData.id_proyecto_etapa,
        id_proyecto_actividad: latestData.id_proyecto_actividad,
      };

      if (latestData.isNew) {
        const created = await createInforme(props.idProyecto, body);
        if (latestData.evidenciaFile && created.id) {
          await uploadEvidencia(props.idProyecto, created.id, latestData.evidenciaFile);
        }
        toast.success("Suceso guardado correctamente");
      } else {
        await updateInforme(props.idProyecto, latestData.id, body);
        if (latestData.evidenciaFile) {
          await uploadEvidencia(props.idProyecto, latestData.id, latestData.evidenciaFile);
        }
        toast.success("Suceso actualizado correctamente");
        props.onToggleEdit(latestData.id, false);
      }
      props.onRefresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al guardar el suceso";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const latestData = props.node.data;
    if (!latestData) return;
    try {
      if (latestData.isNew) {
        props.onRemoveNewRow(latestData.id);
        toast.success("Fila eliminada");
        return;
      }
      await deleteInforme(props.idProyecto, latestData.id);
      toast.success("Suceso eliminado");
      props.onRefresh();
    } catch (err) {
      console.error("Error al eliminar:", err);
      toast.error("Error al eliminar el suceso");
    }
  };

  const isEditable = data.isNew || data.isEditing;

  return (
    <div className="flex items-center gap-1.5 h-full">
      {isEditable ? (
        <>
          <button
            type="button"
            className="inline-flex items-center justify-center h-7 px-2 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-sans cursor-pointer"
            disabled={saving}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleSave();
            }}
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1" />
            )}
            Guardar
          </button>
          {!data.isNew && (
            <button
              type="button"
              className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-input bg-background hover:bg-accent text-muted-foreground transition-colors cursor-pointer"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onToggleEdit(data.id, false);
                props.onRefresh();
              }}
              title="Cancelar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-input bg-background hover:bg-accent text-primary hover:text-primary/80 transition-colors cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              props.onToggleEdit(data.id, true);
            }}
            title="Editar suceso"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center h-7 w-7 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDelete();
            }}
            title="Eliminar suceso"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function InformeGrid({
  idProyecto,
  informes,
  etapas,
  incidencias,
  fecha,
  onRefresh,
}: InformeGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<InformeRowData[]>([]);
  const gridApiRef = useRef<GridApi | null>(null);

  useEffect(() => {
    const existingRows = informes.map(informeToRow);
    // Keep unsaved new rows
    setRowData((prev) => {
      const newRows = prev.filter((r) => r.isNew);
      return [...existingRows, ...newRows];
    });
  }, [informes]);

  const handleAddRow = useCallback(() => {
    const newRow: InformeRowData = {
      id: newRowCounter--,
      fecha: fecha, // Default to the selected date filter
      hora: "",
      descripcion: "",
      id_incidencia: null,
      id_proyecto_etapa: null,
      id_proyecto_actividad: null,
      evidenciaFile: null,
      evidenciaUrl: null,
      isNew: true,
      isSaving: false,
    };
    setRowData((prev) => [...prev, newRow]);
  }, [fecha]);

  const handleRemoveNewRow = useCallback((id: number) => {
    setRowData((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleUpdateRowData = useCallback((id: number, updatedFields: Partial<InformeRowData>) => {
    setRowData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...updatedFields } : row)),
    );
    // Force refresh cells on the next tick so AG Grid picks up the state update
    setTimeout(() => {
      if (gridApiRef.current) {
        const rowNode = gridApiRef.current.getRowNode(String(id));
        if (rowNode) {
          gridApiRef.current.refreshCells({ rowNodes: [rowNode], force: true });
        }
      }
    }, 0);
  }, []);

  const handleToggleEdit = useCallback((id: number, editing: boolean) => {
    setRowData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, isEditing: editing } : row)),
    );
    // Force refresh cells on the next tick so AG Grid picks up the state update
    setTimeout(() => {
      if (gridApiRef.current) {
        const rowNode = gridApiRef.current.getRowNode(String(id));
        if (rowNode) {
          gridApiRef.current.refreshCells({ rowNodes: [rowNode], force: true });
        }
      }
    }, 0);
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  }, []);

  const columnDefs = useMemo<ColDef<InformeRowData>[]>(
    () => [
      {
        headerName: "Horario",
        field: "fecha",
        width: 220,
        cellClass: "font-mono",
        cellRendererSelector: () => ({
          component: HorarioCellRenderer,
          params: { onUpdateRowData: handleUpdateRowData },
        }),
      },
      {
        headerName: "Ocurrencia",
        field: "descripcion",
        flex: 2,
        minWidth: 180,
        cellRendererSelector: () => ({
          component: OcurrenciaCellRenderer,
          params: { onUpdateRowData: handleUpdateRowData },
        }),
      },
      {
        headerName: "Suceso Relacionado",
        field: "id_incidencia",
        width: 180,
        cellRendererSelector: () => ({
          component: IncidenciaCellRenderer,
          params: { incidencias, onUpdateRowData: handleUpdateRowData },
        }),
      },
      {
        headerName: "Evidencia",
        field: "evidenciaUrl",
        width: 160,
        cellRendererSelector: () => ({
          component: FotoCellRenderer,
          params: { idProyecto, onUpdateRowData: handleUpdateRowData },
        }),
      },
      {
        headerName: "Etapa",
        field: "id_proyecto_etapa",
        width: 160,
        cellRendererSelector: () => ({
          component: EtapaCellRenderer,
          params: { etapas, onUpdateRowData: handleUpdateRowData },
        }),
      },
      {
        headerName: "Actividad",
        field: "id_proyecto_actividad",
        width: 160,
        cellRendererSelector: () => ({
          component: ActividadCellRenderer,
          params: { etapas, onUpdateRowData: handleUpdateRowData },
        }),
      },
      {
        headerName: "",
        field: "id",
        width: 140,
        sortable: false,
        filter: false,
        cellRendererSelector: () => ({
          component: ActionsCellRenderer,
          params: {
            idProyecto,
            onRefresh,
            onRemoveNewRow: handleRemoveNewRow,
            onToggleEdit: handleToggleEdit,
          },
        }),
      },
    ],
    [etapas, incidencias, idProyecto, fecha, onRefresh, handleRemoveNewRow, handleToggleEdit, handleUpdateRowData],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      suppressMovable: true,
      suppressKeyboardEvent: () => true,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button
          onClick={handleAddRow}
          className="h-9 px-4 font-medium text-sm rounded-lg gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Añadir Fila
        </Button>
      </div>

      <div
        className="ag-theme-alpine rounded-xl border border-border/60"
        style={{ width: "100%", minHeight: 400 }}
      >
        <AgGridReact<InformeRowData>
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          domLayout="autoHeight"
          rowHeight={44}
          headerHeight={40}
          animateRows={true}
          getRowId={(params) => String(params.data.id)}
          suppressCellFocus={true}
          suppressClickEdit={true}
          rowSelection={{ mode: "singleRow", enableClickSelection: false }}
        />
      </div>
    </div>
  );
}
