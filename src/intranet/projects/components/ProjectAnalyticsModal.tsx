import { useEffect, useState, type FC } from "react";
import { X, AlertTriangle, Clock, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/shared/components/ui/table";
import {
  getProyectoData,
  getIncidenciasDelProyecto,
  getInformesDelProyecto,
  getIncidentsByProject,
  getIncidentObjects,
  getPresupuestoReal,
} from "../api/project-analytics.api";
import type { ProyectoData } from "../api/project-analytics.api";
import type { ProyectoEtapa, ProyectoActividad, Informe, IncidenciaResumen } from "@/intranet/informes/interfaces/informe";
import type { Incident } from "@/intranet/incidents/interfaces/incident";
import type { InvolvedObject } from "@/intranet/incidents/interfaces/incident-quotation";
import type { PresupuestoRealItem, TipoPresupuesto } from "@/intranet/presupuestos/interfaces/presupuesto";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { hideFinancialsInAnalytics, hidePlannedDurationInAnalytics } from "@/intranet/layout/sidebar-links";
import {
  computeActivitySpansFromInformes,
  computeEtapaRealDurations,
  formatDurationHours,
  jornadaDurationHours,
  type ActivityDurationSpan,
} from "@/intranet/informes/lib/informe-duration-analytics";
import {
  getCotizacionServiciosJornada,
  getServiciosActivosEnFecha,
  type CotizacionServicioJornada,
} from "@/intranet/informes/lib/cotizacion-jornada";

interface ProjectAnalyticsModalProps {
  projectId: number;
  projectName: string;
  clientName: string;
  open: boolean;
  onClose: () => void;
}

const TIPOS: { id: string; label: string; tipo: TipoPresupuesto }[] = [
  { id: "Material Directo", label: "Material directo", tipo: "Material Directo" },
  { id: "Mano de Obra", label: "Mano de obra", tipo: "Mano de Obra" },
  { id: "Servicios", label: "Servicio", tipo: "Servicios" },
  { id: "Gastos Administrativos", label: "Gasto Administrativo", tipo: "Gastos Administrativos" },
];

export const ProjectAnalyticsModal: FC<ProjectAnalyticsModalProps> = ({
  projectId,
  projectName,
  clientName,
  open,
  onClose,
}) => {
  const role = useSession((state) => state.loggedUser?.rol);
  const hideFinancials = hideFinancialsInAnalytics(role);
  const hidePlanned = hidePlannedDurationInAnalytics(role);
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState<ProyectoData | null>(null);
  const [etapas, setEtapas] = useState<ProyectoEtapa[]>([]);
  const [incidencias, setIncidencias] = useState<IncidenciaResumen[]>([]);
  const [informes, setInformes] = useState<Informe[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentObjects, setIncidentObjects] = useState<Record<number, InvolvedObject[]>>({});
  const [cotizacionId, setCotizacionId] = useState<number | null>(null);
  const [serviciosCotizacion, setServiciosCotizacion] = useState<CotizacionServicioJornada[]>([]);
  const [presupuestoReal, setPresupuestoReal] = useState<Record<string, PresupuestoRealItem[]>>({});
  const [proyectoNombre, setProyectoNombre] = useState(projectName);

  useEffect(() => {
    if (!open || !projectId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [proyectoData, incidenciasData, informesData, incidentsData] = await Promise.all([
          getProyectoData(projectId),
          getIncidenciasDelProyecto(projectId),
          getInformesDelProyecto(projectId),
          getIncidentsByProject(projectId),
        ]);

        setProyecto(proyectoData);
        setEtapas(proyectoData.etapas ?? []);
        setProyectoNombre(proyectoData.Cotizacion_Nombre ?? proyectoData.Proyecto_Nombre ?? projectName);
        const cotId = proyectoData.id_cotizacion ?? null;
        setCotizacionId(cotId);
        setIncidencias(
          Array.isArray(incidenciasData)
            ? incidenciasData
            : Array.isArray((incidenciasData as Record<string, unknown>)?.data)
              ? (incidenciasData as Record<string, unknown>).data as IncidenciaResumen[]
              : [],
        );
        setInformes(Array.isArray(informesData) ? informesData : []);
        setIncidents(Array.isArray(incidentsData) ? incidentsData : []);
        setCotizacionId(cotId);

        if (cotId) {
          try {
            const servicios = await getCotizacionServiciosJornada(cotId);
            setServiciosCotizacion(servicios);
          } catch {
            setServiciosCotizacion([]);
          }
        } else {
          setServiciosCotizacion([]);
        }

        const objs: Record<number, InvolvedObject[]> = {};
        if (Array.isArray(incidentsData)) {
          const results = await Promise.allSettled(
            incidentsData.map((inc: Incident) =>
              getIncidentObjects(inc.id_incidencia).then((objs) => ({ id: inc.id_incidencia, objs })),
            ),
          );
          for (const r of results) {
            if (r.status === "fulfilled") {
              objs[r.value.id] = r.value.objs;
            }
          }
        }
        setIncidentObjects(objs);

        if (cotId && !hideFinancials) {
          const realResults: Record<string, PresupuestoRealItem[]> = {};
          const tipoResults = await Promise.allSettled(
            TIPOS.map((t) =>
              getPresupuestoReal(cotId, t.tipo).then((items) => ({ tipo: t.id, items })),
            ),
          );
          for (const r of tipoResults) {
            if (r.status === "fulfilled") {
              realResults[r.value.tipo] = r.value.items;
            }
          }
          setPresupuestoReal(realResults);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [open, projectId, projectName, hideFinancials]);

  if (!open) return null;

  const activitySpans = computeActivitySpansFromInformes({
    informes,
    etapas,
    serviciosCotizacion,
  });
  const etapaRealDurations = computeEtapaRealDurations(
    etapas,
    activitySpans,
    serviciosCotizacion,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 flex flex-col bg-card border border-border rounded-xl shadow-2xl"
        style={{ width: "95vw", maxWidth: "1400px", maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card rounded-t-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Analíticas del Proyecto</h2>
              <p className="text-sm text-muted-foreground">{proyectoNombre} / {clientName}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-6 overflow-y-auto flex-1 min-h-0">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <>
              {/* Section 1 & 2: Etapa más reciente + Comparativa de días */}
              <SectionCard
                icon={<BarChart3 size={16} />}
                title="Etapas del Proyecto"
              >
                <EtapaRecienteSection
                  etapas={etapas}
                  informes={informes}
                  hidePlanned={hidePlanned}
                  etapaRealDurations={etapaRealDurations}
                />
              </SectionCard>

              <SectionCard
                icon={<Clock size={16} />}
                title="Duración Real por Etapa y Actividad"
              >
                <ActivityDurationSection spans={activitySpans} />
              </SectionCard>

              <SectionCard
                icon={<Clock size={16} />}
                title="Jornada Programada vs Horas Utilizadas"
              >
                <JornadaComparativaSection
                  serviciosCotizacion={serviciosCotizacion}
                  activitySpans={activitySpans}
                  etapas={etapas}
                />
              </SectionCard>

              {/* Section 3: Incidencias por etapa/actividad */}
              <SectionCard
                icon={<AlertTriangle size={16} />}
                title="Incidencias por Etapa y Actividad"
              >
                <IncidenciasBreakdownSection
                  etapas={etapas}
                  informes={informes}
                  incidencias={incidencias}
                />
              </SectionCard>

              {/* Section 4: Horas perdidas por incidencia */}
              <SectionCard
                icon={<Clock size={16} />}
                title="Horas Perdidas por Incidencia"
              >
                <HorasPerdidasSection
                  incidents={incidents}
                  incidentObjects={incidentObjects}
                  presupuestoReal={presupuestoReal}
                  hideFinancials={hideFinancials}
                />
              </SectionCard>

              {!hideFinancials ? (
                <>
                  <SectionCard
                    icon={<DollarSign size={16} />}
                    title="Suma de Gastos"
                  >
                    <SumaGastosSection
                      presupuestoReal={presupuestoReal}
                      cotizacionId={cotizacionId}
                    />
                  </SectionCard>

                  <SectionCard
                    icon={<Calendar size={16} />}
                    title="Proyección de Pagos"
                  >
                    <ProyeccionPagosSection
                      incidents={incidents}
                      projectId={projectId}
                      fechaFin={proyecto?.fecha_fin ?? null}
                      projectName={proyectoNombre}
                    />
                  </SectionCard>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Section Card wrapper ─────────────────────────────────────────────────────

const SectionCard: FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => (
  <div className="rounded-lg border border-border bg-muted/10 p-5">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-primary">{icon}</span>
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

// ── 1. Etapa más reciente + Comparativa de días ──────────────────────────────

const EtapaRecienteSection: FC<{
  etapas: ProyectoEtapa[];
  informes: Informe[];
  hidePlanned: boolean;
  etapaRealDurations: ReturnType<typeof computeEtapaRealDurations>;
}> = ({ etapas, hidePlanned, etapaRealDurations }) => {
  const sorted = [...etapas].sort((a, b) => a.orden - b.orden);
  const latest = sorted[sorted.length - 1];
  const latestReal = latest
    ? etapaRealDurations.find((e) => e.etapaId === latest.id)
    : undefined;

  return (
    <div className="space-y-4">
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No hay etapas registradas.</p>
      ) : (
        <>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Etapa más reciente
            </p>
            <p className="text-lg font-bold text-foreground">{latest.nombre}</p>
            <p className="text-xs text-muted-foreground">
              Estado: <span className="font-medium">{latest.estado}</span>
              {!hidePlanned ? (
                <>
                  {" | "}Duración planificada:{" "}
                  <span className="font-medium">{latest.duracion} días</span>
                </>
              ) : null}
              {latestReal ? (
                <>
                  {" | "}Duración real:{" "}
                  <span className="font-medium">
                    {latestReal.horasReales > 0
                      ? formatDurationHours(latestReal.horasReales)
                      : "—"}
                  </span>
                </>
              ) : null}
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="[&_tr]:border-b border-gray-200">
                <TableRow className="hover:bg-transparent bg-muted/20">
                  <TableHead className="text-gray-500 font-medium text-xs uppercase">Etapa</TableHead>
                  <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">Orden</TableHead>
                  {!hidePlanned ? (
                    <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">
                      Horas programadas
                    </TableHead>
                  ) : null}
                  <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">
                    Horas reales
                  </TableHead>
                  {!hidePlanned ? (
                    <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">
                      Diferencia (horas)
                    </TableHead>
                  ) : null}
                  <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((etapa) => {
                  const real = etapaRealDurations.find((e) => e.etapaId === etapa.id);
                  const horasReales = real?.horasReales ?? 0;
                  const horasProgramadas = real?.horasProgramadas ?? 0;
                  const diff = Math.round((horasProgramadas - horasReales) * 10) / 10;
                  return (
                    <TableRow key={etapa.id} className="border-b border-gray-100 hover:bg-gray-50/70">
                      <TableCell className="font-medium text-sm">{etapa.nombre}</TableCell>
                      <TableCell className="text-center text-sm">{etapa.orden}</TableCell>
                      {!hidePlanned ? (
                        <TableCell className="text-center font-mono text-sm">
                          {horasProgramadas > 0
                            ? formatDurationHours(horasProgramadas)
                            : "—"}
                        </TableCell>
                      ) : null}
                      <TableCell className="text-center font-mono text-sm">
                        {horasReales > 0 ? formatDurationHours(horasReales) : "—"}
                      </TableCell>
                      {!hidePlanned ? (
                        <TableCell
                          className={`text-center font-mono text-sm ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : ""}`}
                        >
                          {horasProgramadas > 0 || horasReales > 0
                            ? diff !== 0
                              ? (diff > 0 ? `+${formatDurationHours(diff)}` : formatDurationHours(diff))
                              : "0"
                            : "—"}
                        </TableCell>
                      ) : null}
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[11px]">
                          {etapa.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

const ActivityDurationSection: FC<{ spans: ActivityDurationSpan[] }> = ({ spans }) => {
  if (spans.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No hay sucesos con etapa/actividad registrados en informes.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <p className="text-xs text-muted-foreground mb-3">
        La duración se calcula por día según la jornada del servicio de la cotización
        (principal o subservicio). Si el último suceso ocurre antes del fin de jornada,
        se asume cierre al final de la jornada; si ocurre después, se usa la hora del
        último registro (horas extra).
      </p>
      <Table>
        <TableHeader className="[&_tr]:border-b border-gray-200">
          <TableRow className="hover:bg-transparent bg-muted/20">
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Fecha</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Servicio</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Etapa</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Actividad</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">Inicio</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">Fin</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">Duración</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spans.map((span, i) => (
            <TableRow key={`${span.fecha}-${span.etapaId}-${span.actividadId}-${i}`} className="border-b border-gray-100 hover:bg-gray-50/70">
              <TableCell className="text-sm font-mono">{span.fecha}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{span.servicioNombre ?? "—"}</TableCell>
              <TableCell className="text-sm">{span.etapaNombre}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{span.actividadNombre}</TableCell>
              <TableCell className="text-center font-mono text-sm">{span.inicio}</TableCell>
              <TableCell className="text-center font-mono text-sm">{span.fin}</TableCell>
              <TableCell className="text-center font-mono text-sm">
                {formatDurationHours(span.duracionHoras)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const JornadaComparativaSection: FC<{
  serviciosCotizacion: CotizacionServicioJornada[];
  activitySpans: ActivityDurationSpan[];
  etapas: ProyectoEtapa[];
}> = ({ serviciosCotizacion, activitySpans, etapas }) => {
  const etapaOrdenById = new Map(etapas.map((e) => [e.id, e.orden]));

  const fechas = [
    ...new Set([
      ...serviciosCotizacion.flatMap((s) => {
        const dates: string[] = [];
        if (s.fechaInicio) dates.push(s.fechaInicio);
        if (s.fechaFin) dates.push(s.fechaFin);
        return dates;
      }),
      ...activitySpans.map((s) => s.fecha),
    ]),
  ].sort();

  const spansBelongToService = (
    span: ActivityDurationSpan,
    servicio: CotizacionServicioJornada,
    activosEnFecha: CotizacionServicioJornada[],
  ): boolean => {
    const orden = etapaOrdenById.get(span.etapaId) ?? 0;
    if (!servicio.isPrincipal && servicio.faseOrden != null) {
      return orden === servicio.faseOrden;
    }
    if (servicio.isPrincipal) {
      const hasDedicatedSub = activosEnFecha.some(
        (s) => !s.isPrincipal && s.faseOrden === orden,
      );
      return !hasDedicatedSub;
    }
    return false;
  };

  const rows: {
    fecha: string;
    servicio: string;
    jornada: string;
    horasUtilizadas: number;
    horasExtra: number;
  }[] = [];

  for (const fecha of fechas) {
    const activos = getServiciosActivosEnFecha(serviciosCotizacion, fecha);
    const daySpans = activitySpans.filter((s) => s.fecha === fecha);

    if (activos.length === 0 && daySpans.length === 0) continue;

    if (activos.length === 0) {
      const horasUtilizadas = daySpans.reduce((acc, s) => acc + s.duracionHoras, 0);
      rows.push({
        fecha,
        servicio: "—",
        jornada: "—",
        horasUtilizadas,
        horasExtra: 0,
      });
      continue;
    }

    for (const servicio of activos) {
      const programadas = jornadaDurationHours(
        servicio.jornadaInicio,
        servicio.jornadaFin,
      );
      const horasUtilizadas = daySpans
        .filter((s) => spansBelongToService(s, servicio, activos))
        .reduce((acc, s) => acc + s.duracionHoras, 0);
      const extra = programadas > 0 ? Math.max(0, horasUtilizadas - programadas) : 0;

      rows.push({
        fecha,
        servicio: servicio.nombre + (servicio.isPrincipal ? " (principal)" : ""),
        jornada: `${servicio.jornadaInicio} – ${servicio.jornadaFin} (${programadas} h)`,
        horasUtilizadas,
        horasExtra: extra,
      });
    }
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No hay jornadas de cotización ni informes para comparar.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="[&_tr]:border-b border-gray-200">
          <TableRow className="hover:bg-transparent bg-muted/20">
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Fecha</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Servicio</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">
              Jornada programada
            </TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">
              Horas utilizadas
            </TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">
              Horas extra
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={`${row.fecha}-${row.servicio}-${i}`} className="border-b border-gray-100 hover:bg-gray-50/70">
              <TableCell className="font-mono text-sm">{row.fecha}</TableCell>
              <TableCell className="text-sm">{row.servicio}</TableCell>
              <TableCell className="text-center text-sm">{row.jornada}</TableCell>
              <TableCell className="text-center font-mono text-sm">
                {row.horasUtilizadas > 0 ? formatDurationHours(row.horasUtilizadas) : "—"}
              </TableCell>
              <TableCell
                className={`text-center font-mono text-sm ${row.horasExtra > 0 ? "text-amber-600 font-semibold" : ""}`}
              >
                {row.jornada !== "—"
                  ? row.horasExtra > 0
                    ? `+${formatDurationHours(row.horasExtra)}`
                    : "0"
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// ── 2. Incidencias por etapa/actividad (breakdown) ──────────────────────────

interface IncidenciaConImplicancia {
  id_incidencia: number;
  nombre: string;
  implicancia: "Principal" | "Secundaria";
  etapa: string;
  actividad: string;
  cantidad_objetos: number;
  tiemposPerdidos: number[];
}

const IncidenciasBreakdownSection: FC<{
  etapas: ProyectoEtapa[];
  informes: Informe[];
  incidencias: IncidenciaResumen[];
}> = ({ etapas, informes, incidencias }) => {
  const etapaMap = new Map(etapas.map((e) => [e.id, e]));
  const actividadMap = new Map<number, ProyectoActividad>();
  for (const et of etapas) {
    for (const act of et.actividades ?? []) {
      actividadMap.set(act.id, act);
    }
  }

  const rows: IncidenciaConImplicancia[] = [];
  const incidenciaEtapas = new Map<number, Set<number>>();

  const collectTiemposPerdidos = (
    incidenciaId: number,
    etapaId?: number | null,
    actividadId?: number | null,
  ): number[] =>
    informes
      .filter((informe) => {
        if (informe.id_incidencia !== incidenciaId) return false;
        if (etapaId != null && informe.id_proyecto_etapa !== etapaId) return false;
        if (actividadId != null && informe.id_proyecto_actividad !== actividadId) {
          return false;
        }
        return true;
      })
      .map((informe) => informe.tiempo_perdido ?? 0);

  for (const inf of informes) {
    if (!inf.id_incidencia) continue;
    if (!incidenciaEtapas.has(inf.id_incidencia)) {
      incidenciaEtapas.set(inf.id_incidencia, new Set());
    }
    if (inf.id_proyecto_etapa) {
      incidenciaEtapas.get(inf.id_incidencia)!.add(inf.id_proyecto_etapa);
    }
  }

  for (const inc of incidencias) {
    const etapasDeIncidencia = incidenciaEtapas.get(inc.id_incidencia);
    if (!etapasDeIncidencia || etapasDeIncidencia.size === 0) {
      rows.push({
        id_incidencia: inc.id_incidencia,
        nombre: inc.nombre_incidencia ?? `Incidencia #${inc.id_incidencia}`,
        implicancia: "Principal",
        etapa: "Sin etapa asignada",
        actividad: "—",
        cantidad_objetos: 0,
        tiemposPerdidos: collectTiemposPerdidos(inc.id_incidencia),
      });
      continue;
    }

    let isFirst = true;
    for (const etapaId of etapasDeIncidencia) {
      const etapa = etapaMap.get(etapaId);
      const etapaName = etapa?.nombre ?? `Etapa #${etapaId}`;
      const infsForAct = informes.filter(
        (i) => i.id_incidencia === inc.id_incidencia && i.id_proyecto_etapa === etapaId,
      );
      const actividadIds = new Set(infsForAct.map((i) => i.id_proyecto_actividad).filter(Boolean));

      if (actividadIds.size === 0) {
        rows.push({
          id_incidencia: inc.id_incidencia,
          nombre: inc.nombre_incidencia ?? `Incidencia #${inc.id_incidencia}`,
          implicancia: isFirst ? "Principal" : "Secundaria",
          etapa: etapaName,
          actividad: "—",
          cantidad_objetos: 0,
          tiemposPerdidos: collectTiemposPerdidos(inc.id_incidencia, etapaId),
        });
        isFirst = false;
        continue;
      }

      for (const actId of actividadIds) {
        const actividad = actividadMap.get(actId as number);
        rows.push({
          id_incidencia: inc.id_incidencia,
          nombre: inc.nombre_incidencia ?? `Incidencia #${inc.id_incidencia}`,
          implicancia: isFirst ? "Principal" : "Secundaria",
          etapa: etapaName,
          actividad: actividad?.nombre ?? `Actividad #${actId}`,
          cantidad_objetos: 0,
          tiemposPerdidos: collectTiemposPerdidos(
            inc.id_incidencia,
            etapaId,
            actId as number,
          ),
        });
        isFirst = false;
      }
    }
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No hay incidencias vinculadas a etapas o actividades.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="[&_tr]:border-b border-gray-200">
          <TableRow className="hover:bg-transparent bg-muted/20">
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Incidencia</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Implicancia</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Etapa</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Actividad</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">
              Tiempo perdido (hrs)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} className="border-b border-gray-100 hover:bg-gray-50/70">
              <TableCell className="font-medium text-sm">{row.nombre}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-[11px] ${row.implicancia === "Principal" ? "border-red-300 text-red-700 bg-red-50" : "border-gray-300 text-gray-600 bg-gray-50"}`}
                >
                  {row.implicancia}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{row.etapa}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.actividad}</TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                {row.tiemposPerdidos.length > 0
                  ? row.tiemposPerdidos.join(", ")
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// ── 3. Horas perdidas por incidencia ────────────────────────────────────────

interface HoraPerdidaRow {
  id_incidencia: number;
  nombre: string;
  horas: number;
  costo_x_hora: number;
  total: number;
  objetos: number;
}

const HorasPerdidasSection: FC<{
  incidents: Incident[];
  incidentObjects: Record<number, InvolvedObject[]>;
  presupuestoReal: Record<string, PresupuestoRealItem[]>;
  hideFinancials?: boolean;
}> = ({ incidents, incidentObjects, presupuestoReal, hideFinancials = false }) => {
  const rows: HoraPerdidaRow[] = incidents.map((inc) => {
    const itemsManoObra = (presupuestoReal["Mano de Obra"] ?? []).filter(
      (item) => item.ID_Incidencia === inc.id_incidencia,
    );
    const totalHoras = itemsManoObra.reduce(
      (s, item) => s + (parseFloat(item.hora_total ?? "0") || 0),
      0,
    );
    const costoHora = itemsManoObra.reduce(
      (s, item) => s + (parseFloat(item.costo_x_hora ?? "0") || 0),
      0,
    );
    const totalCosto = itemsManoObra.reduce(
      (s, item) => s + (parseFloat(item.costo_total) || 0),
      0,
    );
    const objs = incidentObjects[inc.id_incidencia] ?? [];

    return {
      id_incidencia: inc.id_incidencia,
      nombre: inc.nombre_incidencia ?? `Incidencia #${inc.id_incidencia}`,
      horas: totalHoras,
      costo_x_hora: costoHora,
      total: totalCosto,
      objetos: objs.length,
    };
  });

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No hay incidencias registradas para este proyecto.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="[&_tr]:border-b border-gray-200">
          <TableRow className="hover:bg-transparent bg-muted/20">
            <TableHead className="text-gray-500 font-medium text-xs uppercase">Incidencia</TableHead>
            <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">Horas Perdidas</TableHead>
            {!hideFinancials ? (
              <>
                <TableHead className="text-gray-500 font-medium text-xs uppercase text-right">Costo x Hora</TableHead>
                <TableHead className="text-gray-500 font-medium text-xs uppercase text-right">Costo Total</TableHead>
              </>
            ) : null}
            <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">Objetos Involucrados</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id_incidencia}
              className="border-b border-gray-100 hover:bg-gray-50/70"
            >
              <TableCell className="font-medium text-sm">{row.nombre}</TableCell>
              <TableCell className="text-center font-mono text-sm">
                {row.horas > 0 ? `${row.horas.toFixed(1)} h` : "—"}
              </TableCell>
              {!hideFinancials ? (
                <>
                  <TableCell className="text-right font-mono text-sm">
                    {row.costo_x_hora > 0 ? `S/ ${row.costo_x_hora.toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">
                    {row.total > 0 ? `S/ ${row.total.toFixed(2)}` : "—"}
                  </TableCell>
                </>
              ) : null}
              <TableCell className="text-center font-mono text-sm">{row.objetos}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// ── 4. Suma de Gastos (same as SumaGastosModal) ─────────────────────────────

const SumaGastosSection: FC<{
  presupuestoReal: Record<string, PresupuestoRealItem[]>;
  cotizacionId: number | null;
}> = ({ presupuestoReal, cotizacionId }) => {
  const [activeTab, setActiveTab] = useState<string>("Material Directo");

  if (!cotizacionId) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No se encontró cotización asociada al proyecto.
      </p>
    );
  }

  const allItems = Object.values(presupuestoReal).flat();
  const totalGeneral = allItems.reduce((s, i) => s + (parseFloat(i.costo_total) || 0), 0);
  const totalReal = allItems.reduce((s, i) => s + (parseFloat(i.costo_real ?? "0") || 0), 0);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TIPOS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {TIPOS.map((tab) =>
        activeTab === tab.id ? (
          <div key={tab.id} className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader className="[&_tr]:border-b border-gray-200">
                <TableRow className="hover:bg-transparent bg-muted/20">
                  <TableHead className="text-gray-500 font-medium text-xs uppercase">Nombre</TableHead>
                  <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">Cantidad</TableHead>
                  <TableHead className="text-gray-500 font-medium text-xs uppercase text-right">Costo Unit.</TableHead>
                  <TableHead className="text-gray-500 font-medium text-xs uppercase text-right">Total</TableHead>
                  <TableHead className="text-gray-500 font-medium text-xs uppercase text-right">Gasto Real</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(presupuestoReal[tab.id] ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground italic text-sm">
                      No hay gastos de este tipo.
                    </TableCell>
                  </TableRow>
                ) : (
                  (presupuestoReal[tab.id] ?? []).map((item) => (
                    <TableRow key={item.ID} className="border-b border-gray-100 hover:bg-gray-50/70">
                      <TableCell className="font-medium text-sm">{item.nombre_gasto}</TableCell>
                      <TableCell className="text-center font-mono text-sm">{item.cantidad ?? "—"}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {item.costo_unitario ? `S/ ${parseFloat(item.costo_unitario).toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        S/ {parseFloat(item.costo_total).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {item.costo_real ? `S/ ${parseFloat(item.costo_real).toFixed(2)}` : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : null,
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">Total Cotizado</p>
          <p className="text-lg font-bold text-foreground">S/ {totalGeneral.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">Total Gasto Real</p>
          <p className="text-lg font-bold text-foreground">S/ {totalReal.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">Diferencia</p>
          <p className={`text-lg font-bold ${totalReal - totalGeneral > 0 ? "text-red-600" : "text-green-600"}`}>
            {totalReal - totalGeneral > 0 ? "+" : ""}S/ {(totalReal - totalGeneral).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── 5. Proyección de Pagos ──────────────────────────────────────────────────

const ProyeccionPagosSection: FC<{
  incidents: Incident[];
  projectId: number;
  fechaFin: string | null;
  projectName: string;
}> = ({ incidents, fechaFin }) => {
  const today = new Date();

  const diasParaPagoProyecto = fechaFin
    ? (() => {
        const fin = new Date(fechaFin);
        const diff = Math.ceil((fin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
      })()
    : null;

  const totalRemuneracion = incidents.reduce(
    (s, inc) => s + (inc.cotizacion_remuneracion ?? 0),
    0,
  );

  const pagados = ["Pago realizado", "Material recuperado"] as const;
  const pendientes = incidents.filter(
    (inc) => !pagados.includes(inc.estado as typeof pagados[number]),
  );
  const totalPendiente = pendientes.reduce(
    (s, inc) => s + (inc.cotizacion_remuneracion ?? 0),
    0,
  );

  return (
    <div className="space-y-4">
      {/* Days to payment cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={`rounded-lg border p-4 ${diasParaPagoProyecto !== null && diasParaPagoProyecto < 0 ? "border-red-300 bg-red-50" : "border-border bg-muted/20"}`}>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Días para pago completo del proyecto
          </p>
          <p className={`text-2xl font-bold mt-1 ${diasParaPagoProyecto !== null && diasParaPagoProyecto < 0 ? "text-red-600" : "text-foreground"}`}>
            {diasParaPagoProyecto !== null
              ? diasParaPagoProyecto >= 0
                ? `${diasParaPagoProyecto} días`
                : `${Math.abs(diasParaPagoProyecto)} días (vencido)`
              : "No definido"}
          </p>
          {fechaFin && (
            <p className="text-xs text-muted-foreground mt-1">
              Fecha estimada: {new Date(fechaFin).toLocaleDateString("es-PE")}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Días para pago de cotizaciones de incidencias
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {pendientes.length > 0
              ? `${pendientes.length} incidencias pendientes`
              : "Sin incidencias pendientes"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Monto total pendiente: S/ {totalPendiente.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            * Las fechas de vencimiento de cotizaciones de incidencias se gestionan desde el módulo de incidencias
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Total Remuneración Incidencias
          </p>
          <p className="text-xl font-bold text-foreground mt-1">
            S/ {totalRemuneracion.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Pendiente de Pago (Incidencias)
          </p>
          <p className="text-xl font-bold text-amber-600 mt-1">
            S/ {totalPendiente.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Incidencias Pendientes
          </p>
          <p className="text-xl font-bold text-foreground mt-1">
            {pendientes.length} de {incidents.length}
          </p>
        </div>
      </div>

      {/* Per-incident breakdown */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="[&_tr]:border-b border-gray-200">
            <TableRow className="hover:bg-transparent bg-muted/20">
              <TableHead className="text-gray-500 font-medium text-xs uppercase">Incidencia</TableHead>
              <TableHead className="text-gray-500 font-medium text-xs uppercase">Estado</TableHead>
              <TableHead className="text-gray-500 font-medium text-xs uppercase text-right">Remuneración</TableHead>
              <TableHead className="text-gray-500 font-medium text-xs uppercase text-center">Estado Pago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground italic text-sm">
                  No hay incidencias registradas.
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((inc) => (
                <TableRow
                  key={inc.id_incidencia}
                  className="border-b border-gray-100 hover:bg-gray-50/70"
                >
                  <TableCell className="font-medium text-sm">
                    {inc.nombre_incidencia ?? `Incidencia #${inc.id_incidencia}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[11px]">
                      {inc.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {inc.cotizacion_remuneracion
                      ? `S/ ${inc.cotizacion_remuneracion.toFixed(2)}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {pagados.includes(inc.estado as typeof pagados[number]) ? (
                      <Badge className="bg-green-100 text-green-700 border-green-300 text-[11px]">
                        Pagado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-300 text-[11px]">
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};


