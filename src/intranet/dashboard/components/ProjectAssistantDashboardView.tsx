import { useMemo, useState, type ComponentType } from "react";
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
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  MessageSquareWarning,
  Scale,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { formatCurrency } from "@/shared/lib/format-currency";
import { useProjectAssistantDashboard } from "../hooks/useProjectAssistantDashboard";
import { applyOperationalFilters } from "../lib/operational-dashboard-filters";
import {
  DEFAULT_OPERATIONAL_FILTERS,
  type OperationalDashboardFilters,
  type OperationalPipelineStatus,
} from "../interfaces/project-assistant-dashboard.types";
import { OperationalFiltersBar } from "./OperationalFiltersBar";
import { OperationalPipelineStepper } from "./OperationalPipelineStepper";
import { OperationalPipelineTable } from "./OperationalPipelineTable";
import { InteractionFeedPanel } from "./InteractionFeedPanel";
import { DashboardCardInfo } from "./DashboardCardInfo";
import { OperationalAmountFunnel } from "./OperationalAmountFunnel";

type ColorTheme = {
  bar: string;
  iconBg: string;
  iconShadow: string;
  glow: string;
  badge: string;
  softBg: string;
};

const OPERATIONAL_KPI_THEMES: ColorTheme[] = [
  {
    bar: "from-amber-500 to-orange-500",
    iconBg: "from-amber-500 to-orange-500",
    iconShadow: "shadow-amber-500/40",
    glow: "bg-amber-500/10",
    badge: "bg-amber-100 text-amber-700",
    softBg: "from-amber-50/90 to-orange-50/50",
  },
  {
    bar: "from-sky-500 to-blue-600",
    iconBg: "from-sky-500 to-blue-600",
    iconShadow: "shadow-sky-500/40",
    glow: "bg-sky-500/10",
    badge: "bg-sky-100 text-sky-700",
    softBg: "from-sky-50/90 to-blue-50/50",
  },
  {
    bar: "from-emerald-500 to-teal-600",
    iconBg: "from-emerald-500 to-teal-600",
    iconShadow: "shadow-emerald-500/40",
    glow: "bg-emerald-500/10",
    badge: "bg-emerald-100 text-emerald-700",
    softBg: "from-emerald-50/90 to-teal-50/50",
  },
  {
    bar: "from-rose-500 to-red-600",
    iconBg: "from-rose-500 to-red-600",
    iconShadow: "shadow-rose-500/40",
    glow: "bg-rose-500/10",
    badge: "bg-rose-100 text-rose-700",
    softBg: "from-rose-50/90 to-red-50/50",
  },
];

const FINANCIAL_KPI_THEMES: ColorTheme[] = [
  {
    bar: "from-amber-500 to-orange-500",
    iconBg: "from-amber-500 to-orange-500",
    iconShadow: "shadow-amber-500/40",
    glow: "bg-amber-500/10",
    badge: "bg-amber-100 text-amber-700",
    softBg: "from-amber-50/90 to-orange-50/50",
  },
  {
    bar: "from-sky-500 to-blue-600",
    iconBg: "from-sky-500 to-blue-600",
    iconShadow: "shadow-sky-500/40",
    glow: "bg-sky-500/10",
    badge: "bg-sky-100 text-sky-700",
    softBg: "from-sky-50/90 to-blue-50/50",
  },
  {
    bar: "from-emerald-500 to-teal-600",
    iconBg: "from-emerald-500 to-teal-600",
    iconShadow: "shadow-emerald-500/40",
    glow: "bg-emerald-500/10",
    badge: "bg-emerald-100 text-emerald-700",
    softBg: "from-emerald-50/90 to-teal-50/50",
  },
  {
    bar: "from-violet-500 to-purple-600",
    iconBg: "from-violet-500 to-purple-600",
    iconShadow: "shadow-violet-500/40",
    glow: "bg-violet-500/10",
    badge: "bg-violet-100 text-violet-700",
    softBg: "from-violet-50/90 to-purple-50/50",
  },
];

const KPI_HELP = {
  pendingRequests:
    "Solicitudes en estado pendiente que aún no han sido atendidas o convertidas en cotización.",
  quotationsInReview:
    "Cotizaciones enviadas al cliente con conversación activa o feedback pendiente.",
  approvedQuotations:
    "Cotizaciones aprobadas o con orden de compra lista para generar el proyecto.",
  unansweredMessages:
    "Cotizaciones con mensajes del cliente sin respuesta del equipo interno.",
} as const;

const FINANCIAL_HELP = {
  negotiationAmount:
    "Suma del valor de cotizaciones con mensajes pendientes o en espera de aprobación de orden de compra.",
  reviewAmount:
    "Monto total de cotizaciones enviadas al cliente que están en proceso de revisión.",
  approvedReadyAmount:
    "Valor económico de cotizaciones aprobadas listas para convertirse en proyecto.",
  conversionRate:
    "Porcentaje de cotizaciones aprobadas respecto al total de cotizaciones enviadas al cliente.",
} as const;

const formatPen = (amount: number) => formatCurrency(amount, "PEN", 0);

function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </h2>
  );
}

function OperationalKpiCard({
  title,
  value,
  detail,
  icon: Icon,
  theme,
  info,
  action,
  compactValue = false,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  theme: ColorTheme;
  info: string;
  action?: React.ReactNode;
  compactValue?: boolean;
}) {
  return (
    <Card
      className={`group relative overflow-hidden border-0 bg-gradient-to-br ${theme.softBg} shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <DashboardCardInfo content={info} />
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.bar}`} />
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${theme.glow}`} />
      <CardHeader className="relative pb-2">
        <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.08em]">
          {title}
        </CardDescription>
        <div className="flex items-start justify-between gap-3 pt-1">
          <CardTitle
            className={
              compactValue
                ? "text-xl font-bold leading-tight md:text-2xl"
                : "text-2xl font-bold md:text-3xl"
            }
          >
            {value}
          </CardTitle>
          <div
            className={`rounded-xl bg-gradient-to-br ${theme.iconBg} p-2.5 shadow-lg ${theme.iconShadow}`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-2">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${theme.badge}`}
        >
          {detail}
        </span>
        {action}
      </CardContent>
    </Card>
  );
}

function countByStatus(
  pipeline: { status: OperationalPipelineStatus }[],
): Record<OperationalPipelineStatus, number> {
  return {
    Pendiente: pipeline.filter((r) => r.status === "Pendiente").length,
    Cotizado: pipeline.filter((r) => r.status === "Cotizado").length,
    Aprobado: pipeline.filter((r) => r.status === "Aprobado").length,
    "En Ejecución": pipeline.filter((r) => r.status === "En Ejecución").length,
  };
}

export default function ProjectAssistantDashboardView() {
  const { data: rawData, isPending, isError, refetch } =
    useProjectAssistantDashboard();
  const [filters, setFilters] = useState<OperationalDashboardFilters>(
    DEFAULT_OPERATIONAL_FILTERS,
  );
  const data = useMemo(
    () => applyOperationalFilters(rawData, filters),
    [rawData, filters],
  );
  const userName = useSession((s) => s.loggedUser?.nombres);

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const stageCounts = useMemo(
    () => countByStatus(rawData?.pipeline ?? []),
    [rawData?.pipeline],
  );

  if (isPending) {
    return (
      <div className="space-y-4 px-1">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`op-${i}`} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`fin-${i}`} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No se pudo cargar el panel operativo.
        </p>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-full px-1">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/3 -left-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
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
              Panel Operativo
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Panel de Gestión Operativa — SWEFIRE
            </h1>
            <p className="max-w-xl text-sm text-[#94A3B8]">
              {userName ? `Bienvenido/a, ${userName}. ` : ""}
              Control de flujo de preventa, requerimientos y asignación de
              proyectos.
            </p>
          </div>
          <div className="rounded-xl border border-slate-600/50 bg-[#0F172A]/60 p-4 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Hoy
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-white">
              {today}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-600/40 bg-slate-800/80 px-3 py-1 text-xs text-slate-200">
              <Zap className="h-3.5 w-3.5 text-amber-400/90" />
              Pipeline activo: {formatPen(data.financial.pipelineValue)}
            </div>
          </div>
        </div>
      </section>

      <OperationalFiltersBar
        filters={filters}
        clientOptions={data.clientOptions}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_OPERATIONAL_FILTERS)}
      />

      <BlockTitle>Indicadores operativos</BlockTitle>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <OperationalKpiCard
          title="Solicitudes Pendientes"
          value={String(data.kpis.pendingRequests)}
          detail="Requieren atención inmediata"
          icon={ClipboardList}
          theme={OPERATIONAL_KPI_THEMES[0]}
          info={KPI_HELP.pendingRequests}
        />
        <OperationalKpiCard
          title="Cotizaciones en Revisión"
          value={String(data.kpis.quotationsInReview)}
          detail="Enviadas al cliente para feedback"
          icon={Workflow}
          theme={OPERATIONAL_KPI_THEMES[1]}
          info={KPI_HELP.quotationsInReview}
        />
        <OperationalKpiCard
          title="Cotizaciones Aprobadas"
          value={String(data.kpis.approvedQuotations)}
          detail="Listas para conversión a Proyecto"
          icon={CheckCircle2}
          theme={OPERATIONAL_KPI_THEMES[2]}
          info={KPI_HELP.approvedQuotations}
          action={
            data.kpis.approvedQuotations > 0 ? (
              <Button
                asChild
                size="sm"
                className="h-7 bg-emerald-600 text-[11px] hover:bg-emerald-700"
              >
                <Link to="/intranet/cotizaciones/?pendiente_aprobacion=true">
                  Generar Proyecto
                  <ArrowRight className="ml-1 size-3" />
                </Link>
              </Button>
            ) : null
          }
        />
        <OperationalKpiCard
          title="Mensajes / Consultas Sin Responder"
          value={String(data.kpis.unansweredMessages)}
          detail="Alertas internas en solicitudes"
          icon={MessageSquareWarning}
          theme={OPERATIONAL_KPI_THEMES[3]}
          info={KPI_HELP.unansweredMessages}
        />
      </div>

      <BlockTitle>Indicadores económicos</BlockTitle>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <OperationalKpiCard
          title="Monto en Negociación"
          value={formatPen(data.financial.negotiationAmount)}
          detail={`${data.financial.negotiationCount} cotiz. con observaciones del cliente`}
          icon={ClipboardCheck}
          theme={FINANCIAL_KPI_THEMES[0]}
          info={FINANCIAL_HELP.negotiationAmount}
          compactValue
        />
        <OperationalKpiCard
          title="Valor en Revisión"
          value={formatPen(data.financial.reviewAmount)}
          detail={`${data.financial.reviewCount} cotizaciones en feedback`}
          icon={Banknote}
          theme={FINANCIAL_KPI_THEMES[1]}
          info={FINANCIAL_HELP.reviewAmount}
          compactValue
        />
        <OperationalKpiCard
          title="Listas para Proyecto"
          value={formatPen(data.financial.approvedReadyAmount)}
          detail={`${data.financial.approvedReadyCount} cotiz. por convertir`}
          icon={Scale}
          theme={FINANCIAL_KPI_THEMES[2]}
          info={FINANCIAL_HELP.approvedReadyAmount}
          compactValue
        />
        <OperationalKpiCard
          title="Tasa de Conversión"
          value={`${data.financial.conversionRate}%`}
          detail={`Ingresos aprobados: ${formatPen(data.financial.estimatedRevenue)}`}
          icon={TrendingUp}
          theme={FINANCIAL_KPI_THEMES[3]}
          info={FINANCIAL_HELP.conversionRate}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <Card className="border-0 bg-white/90 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-2.5">
              <div className="rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 p-2 shadow-lg">
                <Workflow className="size-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Pipeline de Conversión Operativa
                </CardTitle>
                <CardDescription>
                  Seguimiento del flujo desde solicitud hasta proyecto en
                  ejecución.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/50 p-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Embudo comercial (S/.)
                </p>
                <OperationalAmountFunnel
                  stages={data.financial.funnelAmountStages}
                  formatValue={(value) => formatPen(value)}
                />
              </div>

              <OperationalPipelineStepper counts={stageCounts} className="mb-0" />
            </div>

            <OperationalPipelineTable
              rows={data.pipeline}
              quotations={data.quotations}
            />
          </CardContent>
        </Card>

        <InteractionFeedPanel items={data.interactions} />
      </div>
    </div>
  );
}
