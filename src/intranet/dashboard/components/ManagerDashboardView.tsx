import { useState, type ComponentType } from "react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  BriefcaseBusiness,
  ClipboardCheck,
  Gavel,
  Package,
  Scale,
  ShieldAlert,
  TrendingUp,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { ProjectStatesRecord } from "@/intranet/projects/enum/project-state.record";
import { ProjectAnalyticsModal } from "@/intranet/projects/components/ProjectAnalyticsModal";
import { useManagerDashboard } from "../hooks/useManagerDashboard";
import { useFilteredDashboard } from "../lib/dashboard-filters";
import {
  DASHBOARD_THRESHOLDS,
  type DashboardFilters,
} from "../interfaces/manager-dashboard.types";
import type { Project } from "@/intranet/projects/interfaces/project";
import {
  DashboardFiltersBar,
  DEFAULT_DASHBOARD_FILTERS,
} from "./DashboardFiltersBar";
import {
  DonutChart,
  FunnelChart,
  GaugeChart,
  MarginBar,
  MermaBarChart,
} from "./DashboardCharts";
import { DashboardCardInfo } from "./DashboardCardInfo";
import { DASHBOARD_METRIC_HELP } from "../lib/dashboard-metric-help";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(amount);

type ColorTheme = {
  bar: string;
  iconBg: string;
  iconShadow: string;
  glow: string;
  badge: string;
  softBg: string;
};

const KPI_THEMES: ColorTheme[] = [
  {
    bar: "from-emerald-500 to-teal-600",
    iconBg: "from-emerald-500 to-teal-600",
    iconShadow: "shadow-emerald-500/40",
    glow: "bg-emerald-500/10",
    badge: "bg-emerald-100 text-emerald-700",
    softBg: "from-emerald-50/90 to-teal-50/50",
  },
  {
    bar: "from-amber-500 to-orange-500",
    iconBg: "from-amber-500 to-orange-500",
    iconShadow: "shadow-amber-500/40",
    glow: "bg-amber-500/10",
    badge: "bg-amber-100 text-amber-700",
    softBg: "from-amber-50/90 to-orange-50/50",
  },
  {
    bar: "from-violet-500 to-purple-600",
    iconBg: "from-violet-500 to-purple-600",
    iconShadow: "shadow-violet-500/40",
    glow: "bg-violet-500/10",
    badge: "bg-violet-100 text-violet-700",
    softBg: "from-violet-50/90 to-purple-50/50",
  },
  {
    bar: "from-sky-500 to-blue-600",
    iconBg: "from-sky-500 to-blue-600",
    iconShadow: "shadow-sky-500/40",
    glow: "bg-sky-500/10",
    badge: "bg-sky-100 text-sky-700",
    softBg: "from-sky-50/90 to-blue-50/50",
  },
];

const DONUT_COLORS = ["#f59e0b", "#0ea5e9", "#10b981", "#8b5cf6", "#94a3b8"];

function getProjectLabel(project: Project) {
  return project.Cotizacion_Nombre ?? project.descripcion_servicio;
}

function SectionHeader({
  icon: Icon,
  title,
  description,
  accent = "from-primary to-accent",
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`rounded-xl bg-gradient-to-br ${accent} p-2.5 shadow-lg shrink-0`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </div>
  );
}

function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </h2>
  );
}

function CriticalKpiCard({
  title,
  value,
  detail,
  icon: Icon,
  theme,
  alert,
  info,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  theme: ColorTheme;
  alert?: boolean;
  info: string;
}) {
  return (
    <Card
      className={`group relative overflow-hidden border-0 bg-gradient-to-br ${theme.softBg} shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${alert ? "ring-2 ring-red-400 ring-offset-2 animate-pulse" : ""}`}
    >
      <DashboardCardInfo content={info} />
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.bar}`} />
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${theme.glow}`} />
      <CardHeader className="relative pb-2">
        <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.08em]">
          {title}
        </CardDescription>
        <div className="flex items-start justify-between gap-3 pt-1">
          <CardTitle className="text-2xl font-bold md:text-3xl">{value}</CardTitle>
          <div
            className={`rounded-xl bg-gradient-to-br ${theme.iconBg} p-2.5 shadow-lg ${theme.iconShadow}`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${theme.badge}`}>
          {detail}
        </span>
      </CardContent>
    </Card>
  );
}

export default function ManagerDashboardView() {
  const { data: rawData, isPending, isError, refetch } = useManagerDashboard();
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_DASHBOARD_FILTERS);
  const data = useFilteredDashboard(rawData, filters);
  const userName = useSession((s) => s.loggedUser?.nombres);
  const [analyticsProject, setAnalyticsProject] = useState<{
    id: number;
    name: string;
    client: string;
  } | null>(null);

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const mermaCritical =
    (data?.globalMermaPercent ?? 0) >= DASHBOARD_THRESHOLDS.mermaCritical;
  const conversionLow =
    (data?.conversionRate ?? 100) < DASHBOARD_THRESHOLDS.conversionLow;
  const fleetLow =
    (data?.fleetSummary.availabilityPercent ?? 100) < DASHBOARD_THRESHOLDS.fleetLow;
  const marginLow =
    (data?.marginSummary.marginPercent ?? 100) < DASHBOARD_THRESHOLDS.marginLow;

  const donutSegments = data
    ? [
        { label: ProjectStatesRecord.pending, value: data.projectsByState[ProjectStatesRecord.pending], color: DONUT_COLORS[0] },
        { label: ProjectStatesRecord.inExecution, value: data.projectsByState[ProjectStatesRecord.inExecution], color: DONUT_COLORS[1] },
        { label: ProjectStatesRecord.completed, value: data.projectsByState[ProjectStatesRecord.completed], color: DONUT_COLORS[2] },
        { label: ProjectStatesRecord.legalProcess, value: data.projectsByState[ProjectStatesRecord.legalProcess], color: DONUT_COLORS[3] },
      ].filter((s) => s.value > 0)
    : [];

  return (
    <div className="relative min-h-full">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/3 -left-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <section
        className="relative mb-5 overflow-hidden rounded-2xl p-5 shadow-lg shadow-slate-900/20 md:p-8"
        style={{ backgroundColor: "#1E293B" }}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/[0.03]" />
        <div className="pointer-events-none absolute -bottom-8 left-1/4 h-32 w-32 rounded-full bg-white/[0.02]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit border-slate-600/60 bg-slate-700/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-300 hover:bg-slate-700/40">
              Panel Gerencial
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Panel de Control Ejecutivo — SWEFIRE
            </h1>
            <p className="max-w-xl text-sm text-[#94A3B8]">
              {userName ? `Bienvenido/a, ${userName}. ` : ""}
              Salud financiera, logística, operaciones y riesgos en una sola vista.
            </p>
          </div>
          <div className="rounded-xl border border-slate-600/50 bg-[#0F172A]/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Hoy
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-white">{today}</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-600/40 bg-slate-800/80 px-3 py-1 text-xs text-slate-200">
              <Zap className="h-3.5 w-3.5 text-amber-400/90" />
              {data ? `${data.criticalIncidentsToday} incidencias críticas` : "Cargando..."}
            </div>
          </div>
        </div>
      </section>

      {rawData && (
        <DashboardFiltersBar
          filters={filters}
          projects={rawData.projects}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_DASHBOARD_FILTERS)}
        />
      )}

      {isError && (
        <section className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">No se pudieron cargar los indicadores.</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
            Reintentar
          </Button>
        </section>
      )}

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          : data && (
              <>
                <CriticalKpiCard
                  title="Ratio de Conversión"
                  value={`${data.conversionRate}%`}
                  detail="Cotizaciones aprobadas vs. enviadas"
                  icon={TrendingUp}
                  theme={KPI_THEMES[0]}
                  alert={conversionLow}
                  info={DASHBOARD_METRIC_HELP.conversionRate}
                />
                <CriticalKpiCard
                  title="Monto en Negociación"
                  value={formatCurrency(data.negotiationAmount)}
                  detail={`${data.negotiationCount} cotiz. con observaciones del cliente`}
                  icon={ClipboardCheck}
                  theme={KPI_THEMES[1]}
                  alert={data.negotiationCount > 0}
                  info={DASHBOARD_METRIC_HELP.negotiationAmount}
                />
                <CriticalKpiCard
                  title="Margen Neto Realizado"
                  value={`${data.marginSummary.marginPercent}%`}
                  detail={`Estimado ${formatCurrency(data.marginSummary.budgeted)}`}
                  icon={Scale}
                  theme={KPI_THEMES[2]}
                  alert={marginLow}
                  info={DASHBOARD_METRIC_HELP.netMargin}
                />
                <CriticalKpiCard
                  title="Disponibilidad de Flota"
                  value={`${data.fleetSummary.availabilityPercent}%`}
                  detail={`${data.fleetSummary.operational + data.fleetSummary.onRoute} de ${data.fleetSummary.total} camiones`}
                  icon={Truck}
                  theme={KPI_THEMES[3]}
                  alert={fleetLow}
                  info={DASHBOARD_METRIC_HELP.fleetAvailability}
                />
              </>
            )}
      </section>

      {/* Bloque 1: Salud Financiera */}
      <BlockTitle>1 · Salud Financiera y Preventa</BlockTitle>
      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="relative overflow-hidden border-0 shadow-md lg:col-span-2">
          <DashboardCardInfo content={DASHBOARD_METRIC_HELP.commercialFunnel} />
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <CardHeader className="bg-gradient-to-br from-emerald-50/40 to-transparent">
            <SectionHeader
              icon={TrendingUp}
              title="Embudo Comercial"
              description="Flujo desde solicitudes hasta proyectos en ejecución."
              accent="from-emerald-500 to-teal-600"
            />
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <FunnelChart stages={data?.funnelStages ?? []} />
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md">
          <DashboardCardInfo content={DASHBOARD_METRIC_HELP.budgetVsReal} />
          <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
          <CardHeader className="bg-gradient-to-br from-violet-50/40 to-transparent">
            <SectionHeader
              icon={Banknote}
              title="Margen Presupuesto vs. Real"
              description="Comparativa de costo estimado y ejecutado."
              accent="from-violet-500 to-purple-600"
            />
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <MarginBar
                budgeted={data?.marginSummary.budgeted ?? 0}
                actual={data?.marginSummary.actual ?? 0}
              />
            )}
            <Button variant="link" className="mt-3 h-auto p-0 text-violet-700" asChild>
              <Link to="/intranet/presupuestos/">
                Ver presupuesto interno
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Bloque 2: Logística y Mermas */}
      <BlockTitle>2 · Control Logístico y Mermas</BlockTitle>
      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className={`relative overflow-hidden border-0 shadow-md ${mermaCritical ? "ring-2 ring-red-400" : ""}`}>
          <DashboardCardInfo content={DASHBOARD_METRIC_HELP.globalMerma} />
          <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <CardHeader className="bg-gradient-to-br from-red-50/30 to-transparent">
            <SectionHeader
              icon={Package}
              title="Índice Global de Mermas"
              description="Umbral crítico: 10% de pérdida material."
              accent="from-red-500 to-orange-500"
            />
          </CardHeader>
          <CardContent className="flex justify-center">
            {isPending ? (
              <Skeleton className="h-32 w-48" />
            ) : (
              <GaugeChart
                value={data?.globalMermaPercent ?? 0}
                label="Merma inventario"
                thresholds={{ warn: 7, critical: 10 }}
              />
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md lg:col-span-2">
          <DashboardCardInfo content={DASHBOARD_METRIC_HELP.mermaByProject} />
          <div className="h-1 bg-gradient-to-r from-amber-500 to-red-500" />
          <CardHeader className="bg-gradient-to-br from-amber-50/30 to-transparent">
            <SectionHeader
              icon={BarChart3}
              title="Mermas por Proyecto (Material)"
              description="Proyectos que superan el umbral permitido se resaltan en rojo."
              accent="from-amber-500 to-red-500"
            />
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <MermaBarChart rows={data?.mermaByProject ?? []} />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Bloque 3: Operaciones */}
      <BlockTitle>3 · Operaciones y Capacidad Técnica</BlockTitle>
      <section className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="relative overflow-hidden border-0 shadow-md">
          <DashboardCardInfo content={DASHBOARD_METRIC_HELP.projectTraceability} />
          <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
          <CardHeader className="bg-gradient-to-br from-sky-50/40 to-transparent">
            <SectionHeader
              icon={BriefcaseBusiness}
              title="Trazabilidad de Proyectos"
              description="Pendiente, en ejecución y completado."
              accent="from-sky-500 to-blue-600"
            />
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="mx-auto h-40 w-40 rounded-full" />
            ) : (
              <>
                <DonutChart
                  segments={donutSegments}
                  centerValue={String(data?.totalProjects ?? 0)}
                  centerLabel="Proyectos"
                />
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {donutSegments.map((s) => (
                    <span
                      key={s.label}
                      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      {s.label}: {s.value}
                    </span>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card
          className={`relative overflow-hidden border-0 shadow-md ${(data?.maintenanceDelayDays ?? 0) > 0 ? "ring-2 ring-amber-400 animate-pulse" : ""}`}
        >
          <DashboardCardInfo content={DASHBOARD_METRIC_HELP.maintenanceDelay} />
          <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
          <CardHeader className="bg-gradient-to-br from-amber-50/40 to-transparent">
            <SectionHeader
              icon={Wrench}
              title="Retraso en Mantenimientos"
              description="Días de desfase en revisiones de flota."
              accent="from-amber-500 to-yellow-600"
            />
          </CardHeader>
          <CardContent className="text-center py-4">
            {isPending ? (
              <Skeleton className="mx-auto h-20 w-32" />
            ) : (
              <>
                <p
                  className={`text-5xl font-bold ${(data?.maintenanceDelayDays ?? 0) > 0 ? "text-red-600" : "text-emerald-600"}`}
                >
                  {data?.maintenanceDelayDays ?? 0}
                </p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  días de retraso máximo
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {data?.overdueTrucksCount ?? 0} camión(es) con revisión vencida
                </p>
              </>
            )}
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link to="/intranet/trucks">Gestionar flota</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md xl:col-span-1">
          <DashboardCardInfo content={DASHBOARD_METRIC_HELP.activeProjects} />
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-sky-600" />
          <CardHeader className="flex flex-row items-start justify-between bg-gradient-to-br from-cyan-50/40 to-transparent">
            <SectionHeader
              icon={BarChart3}
              title="Proyectos en Ejecución"
              description="Análisis de fases y gastos."
              accent="from-cyan-500 to-sky-600"
            />
          </CardHeader>
          <CardContent className="max-h-64 space-y-2 overflow-y-auto">
            {isPending ? (
              <Skeleton className="h-24 w-full" />
            ) : (data?.activeProjects.length ?? 0) === 0 ? (
              <p className="py-6 text-center text-sm italic text-muted-foreground">
                Sin proyectos en ejecución.
              </p>
            ) : (
              data?.activeProjects.slice(0, 4).map((project) => (
                <div
                  key={project.id_Proyecto}
                  className="flex items-center justify-between gap-2 rounded-lg border border-sky-100 bg-sky-50/50 p-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{getProjectLabel(project)}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {project.Cliente_Nombre}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 shrink-0 bg-violet-600 text-white hover:bg-violet-700"
                    onClick={() =>
                      setAnalyticsProject({
                        id: project.id_Proyecto,
                        name: getProjectLabel(project),
                        client: project.Cliente_Nombre ?? "—",
                      })
                    }
                  >
                    <BarChart3 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
            <Button variant="link" className="h-auto w-full p-0 text-sky-700" asChild>
              <Link to="/intranet/proyectos/">
                Ver todos los proyectos
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Bloque 4: Riesgos y Cierre Legal */}
      <BlockTitle>4 · Control de Riesgos y Cierre Legal</BlockTitle>
      <section className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="relative overflow-hidden border-0 shadow-md">
          <DashboardCardInfo content={DASHBOARD_METRIC_HELP.legalBottleneck} />
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-600" />
          <CardHeader className="bg-gradient-to-br from-violet-50/30 to-transparent">
            <SectionHeader
              icon={Gavel}
              title="Cuello de Botella Documental"
              description="Proyectos legales e incidencias que bloquean cobros."
              accent="from-violet-500 to-indigo-600"
            />
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-40 w-full" />
            ) : (data?.legalBottlenecks.length ?? 0) === 0 ? (
              <p className="py-6 text-center text-sm italic text-muted-foreground">
                Sin trabas documentales registradas.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="pb-2 pr-2">Semáforo</th>
                      <th className="pb-2 pr-2">Caso</th>
                      <th className="pb-2 pr-2">Cliente</th>
                      <th className="pb-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.legalBottlenecks.map((row) => (
                      <tr key={`${row.type}-${row.id}`} className="border-b border-muted/50">
                        <td className="py-2.5 pr-2">
                          <span
                            className={`inline-block h-3 w-3 rounded-full ${row.priority === "critico" ? "bg-red-500 animate-pulse" : row.priority === "medio" ? "bg-amber-500" : "bg-green-500"}`}
                          />
                        </td>
                        <td className="max-w-[140px] truncate py-2.5 pr-2 font-medium">
                          {row.label}
                        </td>
                        <td className="max-w-[100px] truncate py-2.5 pr-2 text-muted-foreground">
                          {row.clientName}
                        </td>
                        <td className="py-2.5">
                          <Badge variant="outline" className="text-[10px]">
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md">
          <DashboardCardInfo content={DASHBOARD_METRIC_HELP.criticalIncidents} />
          <div className="h-1 bg-gradient-to-r from-rose-500 to-pink-600" />
          <CardHeader className="bg-gradient-to-br from-rose-50/30 to-transparent">
            <SectionHeader
              icon={ShieldAlert}
              title="Incidencias Críticas Activas"
              description="Requieren atención inmediata del gerente."
              accent="from-rose-500 to-pink-600"
            />
          </CardHeader>
          <CardContent className="space-y-2">
            {isPending ? (
              <Skeleton className="h-32 w-full" />
            ) : (data?.recentIncidents.length ?? 0) === 0 ? (
              <p className="py-6 text-center text-sm italic text-muted-foreground">
                Sin incidencias abiertas.
              </p>
            ) : (
              data?.recentIncidents.map((incident) => (
                <div
                  key={incident.id_incidencia}
                  className="flex items-center justify-between gap-2 rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {incident.nombre_incidencia ?? `#${incident.id_incidencia}`}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {incident.Cliente_Nombre}
                    </p>
                  </div>
                  <Badge
                    className={
                      incident.estado === "En revisión"
                        ? "bg-red-100 text-red-700 animate-pulse"
                        : "bg-amber-100 text-amber-700"
                    }
                  >
                    {incident.estado}
                  </Badge>
                </div>
              ))
            )}
            <Button
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white"
              asChild
            >
              <Link to="/intranet/incidencias/">
                Gestionar incidencias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {analyticsProject && (
        <ProjectAnalyticsModal
          projectId={analyticsProject.id}
          projectName={analyticsProject.name}
          clientName={analyticsProject.client}
          open={!!analyticsProject}
          onClose={() => setAnalyticsProject(null)}
        />
      )}
    </div>
  );
}
