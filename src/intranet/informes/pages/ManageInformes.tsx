import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import { Hash, FileText, Building2, Calendar, Search } from "lucide-react";
import { InformeGrid } from "../components/InformeGrid";
import {
  getInformes,
  getProyectoConEtapas,
  getIncidenciasDelProyecto,
} from "../api/informe.api";
import type {
  Informe,
  ProyectoEtapa,
  IncidenciaResumen,
} from "../interfaces/informe";
import { toast } from "sonner";

type InformesNavState = {
  projectId?: number;
  projectName?: string | null;
  clientName?: string;
  incidentId?: number;
};

export function ManageInformesPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navState = location.state as InformesNavState | null;

  const projectIdRaw = Number(searchParams.get("id_proyecto"));
  const incidentIdRaw = Number(searchParams.get("id_incidencia"));
  const projectId =
    Number.isInteger(projectIdRaw) && projectIdRaw > 0
      ? projectIdRaw
      : navState?.projectId;

  const incidentFilterFromNavigation = useMemo(() => {
    if (Number.isInteger(incidentIdRaw) && incidentIdRaw > 0) {
      return String(incidentIdRaw);
    }
    if (navState?.incidentId && navState.incidentId > 0) {
      return String(navState.incidentId);
    }
    return "TODO";
  }, [incidentIdRaw, navState?.incidentId]);

  // ── State ──────────────────────────────────────────────────────────────────

  const [informes, setInformes] = useState<Informe[]>([]);
  const [etapas, setEtapas] = useState<ProyectoEtapa[]>([]);
  const [incidencias, setIncidencias] = useState<IncidenciaResumen[]>([]);
  const [projectName, setProjectName] = useState(
    navState?.projectName ?? "—",
  );
  const [clientName, setClientName] = useState(navState?.clientName ?? "—");
  const [loading, setLoading] = useState(true);

  // Filters
  const today = new Date().toISOString().slice(0, 10);
  const [fechaTabla, setFechaTabla] = useState(today);
  const [filterIncidencia, setFilterIncidencia] = useState<string>(
    incidentFilterFromNavigation,
  );
  const [filterEtapa, setFilterEtapa] = useState<string>("TODO");
  const [filterActividad, setFilterActividad] = useState<string>("TODO");
  const [busqueda, setBusqueda] = useState("");

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [informesData, proyectoData, incidenciasData] = await Promise.all([
        getInformes(projectId),
        getProyectoConEtapas(projectId),
        getIncidenciasDelProyecto(projectId),
      ]);
      // Backend may return a plain array or a wrapper object
      const informesList = Array.isArray(informesData)
        ? informesData
        : Array.isArray((informesData as Record<string, unknown>)?.data)
          ? (informesData as Record<string, unknown>).data as Informe[]
          : [];
      setInformes(informesList);
      setEtapas(proyectoData.etapas ?? []);
      setProjectName(
        proyectoData.Proyecto_Nombre ?? navState?.projectName ?? "—",
      );
      setClientName(
        proyectoData.Cliente_Nombre ?? navState?.clientName ?? "—",
      );

      // Normalize incidencias shape
      const rawIncidencias = Array.isArray(incidenciasData)
        ? incidenciasData
        : Array.isArray((incidenciasData as any)?.data)
        ? (incidenciasData as any).data
        : [];
      const normalized: IncidenciaResumen[] = rawIncidencias.map((inc: any) => ({
        id_incidencia: Number(inc.id_incidencia ?? 0),
        nombre_incidencia: inc.nombre_incidencia ?? null,
        estado: inc.estado ?? null,
      }));
      setIncidencias(normalized);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar datos del proyecto");
    } finally {
      setLoading(false);
    }
  }, [projectId, navState?.projectName, navState?.clientName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setFilterIncidencia(incidentFilterFromNavigation);
  }, [incidentFilterFromNavigation]);

  // ── Filtered informes ──────────────────────────────────────────────────────

  const filteredInformes = useMemo(() => {
    let data = Array.isArray(informes) ? informes : [];

    // Filter by fecha
    if (fechaTabla) {
      data = data.filter((inf) => {
        if (!inf.fecha) return false;
        return inf.fecha.slice(0, 10) === fechaTabla;
      });
    }

    // Filter by incidencia
    if (filterIncidencia !== "TODO") {
      if (filterIncidencia === "NINGUNO") {
        data = data.filter((inf) => !inf.id_incidencia);
      } else {
        const id = Number(filterIncidencia);
        data = data.filter((inf) => inf.id_incidencia === id);
      }
    }

    // Filter by etapa
    if (filterEtapa !== "TODO") {
      const etId = Number(filterEtapa);
      data = data.filter((inf) => inf.id_proyecto_etapa === etId);
    }

    // Filter by actividad
    if (filterActividad !== "TODO") {
      const actId = Number(filterActividad);
      data = data.filter((inf) => inf.id_proyecto_actividad === actId);
    }

    // Search by text
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      data = data.filter(
        (inf) =>
          inf.descripcion?.toLowerCase().includes(q) ||
          inf.nombre?.toLowerCase().includes(q),
      );
    }

    return data;
  }, [informes, fechaTabla, filterIncidencia, filterEtapa, filterActividad, busqueda]);

  // ── Actividades for the selected filter etapa ──────────────────────────────

  const filterActividades = useMemo(() => {
    if (filterEtapa === "TODO") return [];
    const et = etapas.find((e) => e.id === Number(filterEtapa));
    return et?.actividades ?? [];
  }, [filterEtapa, etapas]);

  // Reset actividad filter when etapa filter changes
  useEffect(() => {
    setFilterActividad("TODO");
  }, [filterEtapa]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground text-lg">
          No se ha seleccionado un proyecto. Navegue desde Gestionar Proyectos.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Title */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Gestionar Informe
        </h1>
      </div>

      {/* Project Header Card */}
      <div className="bg-card p-5 rounded-xl shadow-xs border mb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-widest">
              <Hash size={10} />
              Proyecto
            </span>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {projectName} / {clientName}
            </h2>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoField
            icon={<FileText size={10} />}
            label="Nombre del informe"
            value={projectName}
          />
          <InfoField
            icon={<Building2 size={10} />}
            label="Cliente"
            value={clientName}
          />
          <InfoField
            icon={<Calendar size={10} />}
            label="Fecha del informe"
            value={today}
          />
        </div>
      </div>

      {/* Filters + Controls Card */}
      <div className="bg-card p-6 rounded-2xl shadow-xs border-2 border-border/80 flex flex-col">
        {/* Search + Date */}
        <div className="flex flex-wrap items-end gap-4 mb-4">
          {/* Search */}
          <div className="flex flex-col gap-1 min-w-[200px] flex-1 max-w-sm">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                className="w-full h-9 pl-8 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Buscar en informes..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          {/* Día en tabla */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Día en tabla
            </label>
            <input
              type="date"
              className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={fechaTabla}
              onChange={(e) => setFechaTabla(e.target.value)}
            />
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-end gap-4 mb-5">
          {/* Incidencia filter */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Filtrar por Incidencia
            </label>
            <select
              className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              value={filterIncidencia}
              onChange={(e) => setFilterIncidencia(e.target.value)}
            >
              <option value="TODO">TODO</option>
              <option value="NINGUNO">Ninguno</option>
              {incidencias.map((inc) => (
                <option key={inc.id_incidencia} value={inc.id_incidencia}>
                  {inc.nombre_incidencia ??
                    `Incidencia ${inc.id_incidencia}`}
                </option>
              ))}
            </select>
          </div>

          {/* Etapa filter */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Etapa
            </label>
            <select
              className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              value={filterEtapa}
              onChange={(e) => setFilterEtapa(e.target.value)}
            >
              <option value="TODO">TODO</option>
              {etapas
                .filter((et) => et.tipo === "cotizacion")
                .map((et) => (
                  <option key={et.id} value={et.id}>
                    {et.nombre}
                  </option>
                ))}
            </select>
          </div>

          {/* Actividad filter */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Actividad
            </label>
            <select
              className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              value={filterActividad}
              onChange={(e) => setFilterActividad(e.target.value)}
              disabled={filterEtapa === "TODO"}
            >
              <option value="TODO">TODO</option>
              {filterActividades.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AG Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Cargando informes...</span>
            </div>
          </div>
        ) : (
          <InformeGrid
            idProyecto={projectId}
            informes={filteredInformes}
            etapas={etapas}
            incidencias={incidencias}
            fecha={fechaTabla}
            onRefresh={fetchData}
          />
        )}
      </div>
    </>
  );
}

// ── Helper component ─────────────────────────────────────────────────────────

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-border/70 bg-muted/20 p-4">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {icon}
        {label}
      </span>
      <p className="min-h-5 text-sm font-semibold leading-snug text-foreground">
        {value}
      </p>
    </div>
  );
}

export default ManageInformesPage;
