import { Link } from "react-router";
import type { ComponentType } from "react";
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
  ClipboardList,
  FileCheck2,
  MessageSquareWarning,
  Plus,
} from "lucide-react";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { useClientDashboard } from "../hooks/useClientDashboard";
import { DashboardCardInfo } from "./DashboardCardInfo";
import { ClientProjectProgressPanel } from "./ClientProjectProgressPanel";
import {
  ClientMessagesAndRequestsPanel,
  ClientQuotationsPanel,
} from "./ClientDashboardPanels";

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
    bar: "from-amber-500 to-orange-500",
    iconBg: "from-amber-500 to-orange-500",
    iconShadow: "shadow-amber-500/40",
    glow: "bg-amber-500/10",
    badge: "bg-amber-100 text-amber-700",
    softBg: "from-amber-50/90 to-orange-50/50",
  },
  {
    bar: "from-rose-500 to-red-600",
    iconBg: "from-rose-500 to-red-600",
    iconShadow: "shadow-rose-500/40",
    glow: "bg-rose-500/10",
    badge: "bg-rose-100 text-rose-700",
    softBg: "from-rose-50/90 to-red-50/50",
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

const KPI_HELP = {
  quotations:
    "Cotizaciones que requieren tu revisión, firma o carga de orden de compra.",
  messages:
    "Conversaciones donde el equipo espera tu respuesta en una cotización.",
  requests:
    "Solicitudes o requerimientos que has enviado y aún están en proceso.",
} as const;

function ClientKpiCard({
  title,
  value,
  detail,
  icon: Icon,
  theme,
  info,
  href,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  theme: ColorTheme;
  info: string;
  href: string;
}) {
  return (
    <Link to={href} className="block">
      <Card
        className={`group relative h-full overflow-hidden border-0 bg-gradient-to-br ${theme.softBg} shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
      >
        <DashboardCardInfo content={info} />
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.bar}`} />
        <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${theme.glow}`} />
        <CardHeader className="relative pb-2">
          <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.08em]">
            {title}
          </CardDescription>
          <div className="flex items-start justify-between gap-3 pt-1">
            <CardTitle className="text-3xl font-bold">{value}</CardTitle>
            <div
              className={`rounded-xl bg-gradient-to-br ${theme.iconBg} p-2.5 shadow-lg ${theme.iconShadow}`}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${theme.badge}`}
          >
            {detail}
          </span>
        </CardContent>
      </Card>
    </Link>
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

export default function ClientDashboardView() {
  const { data, isPending, isError, refetch, isFetching } = useClientDashboard();
  const userName = useSession((s) => s.loggedUser?.nombres);

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (isPending && !data) {
    return (
      <div className="space-y-4 px-1">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No se pudo cargar tu panel de cliente.
        </p>
        <Button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Cargando..." : "Reintentar"}
        </Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="relative min-h-full px-1 pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/3 -left-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <section
        className="relative mb-5 overflow-hidden rounded-2xl p-5 shadow-lg shadow-slate-900/20 md:p-8"
        style={{ backgroundColor: "#1E293B" }}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/[0.03]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit border-slate-600/60 bg-slate-700/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-300 hover:bg-slate-700/40">
              Portal Cliente
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Mi Panel — SWEFIRE
            </h1>
            <p className="max-w-xl text-sm text-[#94A3B8]">
              {userName ? `Bienvenido/a, ${userName}. ` : ""}
              Estado de tu proyecto, cotizaciones y solicitudes en un solo
              vistazo.
            </p>
          </div>
          <div className="rounded-xl border border-slate-600/50 bg-[#0F172A]/60 p-4 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Hoy
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-white">
              {today}
            </p>
          </div>
        </div>
      </section>

      <BlockTitle>Acciones urgentes</BlockTitle>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <ClientKpiCard
          title="Cotizaciones por Aprobar"
          value={String(data.kpis.quotationsToApprove)}
          detail="Requieren tu revisión o firma"
          icon={FileCheck2}
          theme={KPI_THEMES[0]}
          info={KPI_HELP.quotations}
          href="/intranet/cotizaciones/"
        />
        <ClientKpiCard
          title="Mensajes Pendientes"
          value={String(data.kpis.pendingMessages)}
          detail="Esperan tu respuesta"
          icon={MessageSquareWarning}
          theme={KPI_THEMES[1]}
          info={KPI_HELP.messages}
          href="/intranet/cotizaciones/"
        />
        <ClientKpiCard
          title="Solicitudes Abiertas"
          value={String(data.kpis.openRequests)}
          detail="En proceso de atención"
          icon={ClipboardList}
          theme={KPI_THEMES[2]}
          info={KPI_HELP.requests}
          href="/intranet/solicitudes/"
        />
      </div>

      <BlockTitle>Seguimiento del proyecto</BlockTitle>
      <div className="mb-5">
        <ClientProjectProgressPanel progress={data.primaryProgress} />
      </div>

      <BlockTitle>Detalle operativo</BlockTitle>
      <div className="grid gap-5 xl:grid-cols-2">
        <ClientMessagesAndRequestsPanel
          messages={data.recentMessages}
          requests={data.requestSummaries}
        />
        <ClientQuotationsPanel
          quotations={data.quotationSummaries}
          showApproveCta={data.kpis.quotationsToApprove > 0}
          approveQuotationId={data.primaryQuotationToApprove?.ID ?? null}
        />
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 sm:bottom-8 sm:right-8">
        <Button
          asChild
          size="lg"
          className="h-12 rounded-full px-5 shadow-lg shadow-primary/25"
        >
          <Link to="/intranet/solicitudes/crear">
            <Plus className="mr-2 size-5" />
            Nueva solicitud
          </Link>
        </Button>
      </div>
    </div>
  );
}
