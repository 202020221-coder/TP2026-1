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
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  HardHat,
  Plus,
  ShieldAlert,
  Users,
  Wrench,
} from "lucide-react";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { cn } from "@/shared/lib/utils";
import { useFieldSupervisorDashboard } from "../hooks/useFieldSupervisorDashboard";
import { ReportIncidentQuickModal } from "./ReportIncidentQuickModal";
import type { IncidentFlowStage } from "../interfaces/field-supervisor-dashboard.types";

const MODULES = [
  {
    title: "Control de Proyectos",
    description: "Obras asignadas, cronograma y tareas del día",
    href: "/intranet/proyectos/",
    icon: BriefcaseBusiness,
    accent: "from-sky-500 to-blue-600",
  },
  {
    title: "Registro e Incidencias",
    description: "Historial, mitigación y reportes en campo",
    href: "/intranet/incidencias/",
    icon: ClipboardList,
    accent: "from-amber-500 to-orange-600",
  },
  {
    title: "Personal y Recursos",
    description: "Asistencia, herramientas y checklist de seguridad",
    href: "/intranet/organizar-personal/",
    icon: Users,
    accent: "from-emerald-500 to-teal-600",
    secondaryHref: "/intranet/organizar-recursos/",
    secondaryLabel: "Recursos",
  },
] as const;

const FLOW_STYLES: Record<
  IncidentFlowStage,
  { badge: string; step: number }
> = {
  Reportada: { badge: "border-amber-300 bg-amber-50 text-amber-800", step: 1 },
  "En revisión": {
    badge: "border-sky-300 bg-sky-50 text-sky-800",
    step: 2,
  },
  "En proceso": {
    badge: "border-violet-300 bg-violet-50 text-violet-800",
    step: 3,
  },
  Cerrada: { badge: "border-emerald-300 bg-emerald-50 text-emerald-800", step: 4 },
};

function KpiCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  tone: "amber" | "sky" | "rose";
}) {
  const tones = {
    amber: "border-amber-200 bg-amber-50/80 text-amber-900",
    sky: "border-sky-200 bg-sky-50/80 text-sky-900",
    rose: "border-rose-200 bg-rose-50/80 text-rose-900",
  };

  return (
    <Card className={cn("border-2 shadow-sm", tones[tone])}>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">
            {title}
          </p>
          <p className="mt-1 text-3xl font-black tabular-nums">{value}</p>
          <p className="mt-0.5 text-xs font-medium opacity-80">{detail}</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
          <Icon className="size-7" />
        </div>
      </CardContent>
    </Card>
  );
}

function IncidentFlowBar({ stage }: { stage: IncidentFlowStage }) {
  const current = FLOW_STYLES[stage].step;
  const labels = ["Reportada", "Revisión", "Proceso", "Cerrada"];

  return (
    <div className="mt-2 flex items-center gap-1">
      {labels.map((label, index) => {
        const step = index + 1;
        const active = step <= current;
        return (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-1">
            <div
              className={cn(
                "size-2 shrink-0 rounded-full",
                active ? "bg-primary" : "bg-slate-300",
              )}
            />
            {index < labels.length - 1 ? (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded-full",
                  step < current ? "bg-primary" : "bg-slate-200",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function FieldSupervisorDashboardView() {
  const { data, isPending, isError, refetch } = useFieldSupervisorDashboard();
  const userName = useSession((s) => s.loggedUser?.nombres);
  const [reportOpen, setReportOpen] = useState(false);

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  if (isPending) {
    return (
      <div className="space-y-4 px-1 pb-24">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No se pudo cargar el panel de campo.
        </p>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-full px-1 pb-28">
      <section
        className="mb-4 overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-4 shadow-lg sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="mb-2 border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-800">
              Supervisor de Campo
            </Badge>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Panel Operativo — SWEFIRE
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {userName ? `Hola, ${userName}. ` : ""}
              Herramientas rápidas para registrar y supervisar en obra.
            </p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Jornada
            </p>
            <p className="font-semibold capitalize">{today}</p>
          </div>
        </div>
      </section>

      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
        Módulos de acceso
      </h2>
      <div className="mb-5 grid gap-3">
        {MODULES.map((module) => {
          const Icon = module.icon;
          const hasSecondary =
            "secondaryHref" in module && module.secondaryHref;

          return (
            <Card
              key={module.href}
              className="border-2 border-slate-200/90 shadow-sm transition-transform active:scale-[0.99]"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <Link to={module.href} className="flex min-w-0 flex-1 items-center gap-4">
                  <div
                    className={cn(
                      "flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md",
                      module.accent,
                    )}
                  >
                    <Icon className="size-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{module.title}</p>
                    <p className="text-sm text-slate-600">{module.description}</p>
                  </div>
                </Link>
                {hasSecondary ? (
                  <Button asChild variant="outline" size="sm" className="shrink-0">
                    <Link to={module.secondaryHref}>
                      <Wrench className="mr-1 size-3.5" />
                      {module.secondaryLabel}
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
        Control del día
      </h2>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard
          title="Incidencias abiertas"
          value={String(data.kpis.openIncidents)}
          detail="Sin resolver en tus obras"
          icon={AlertTriangle}
          tone="amber"
        />
        <KpiCard
          title="Avance del día"
          value={`${data.kpis.dayProgressPercent}%`}
          detail="Cumplimiento de tareas"
          icon={CalendarDays}
          tone="sky"
        />
        <KpiCard
          title="Alertas de seguridad"
          value={String(data.kpis.safetyAlerts)}
          detail="Requieren atención inmediata"
          icon={ShieldAlert}
          tone="rose"
        />
      </div>

      <Card className="border-2 border-slate-200/90 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Incidencias recientes</CardTitle>
              <CardDescription className="text-xs">
                Tu backlog en campo
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="h-9">
              <Link to="/intranet/incidencias/">Ver todas</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentIncidents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-muted-foreground">
              <HardHat className="mx-auto mb-2 size-8 text-slate-300" />
              No hay incidencias registradas aún.
            </div>
          ) : (
            data.recentIncidents.map((incident) => (
              <Link
                key={incident.id}
                to={`/intranet/incidencias/${incident.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors active:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      #{incident.id} · {incident.title}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {incident.projectLabel}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 text-[10px] font-semibold",
                      FLOW_STYLES[incident.flowStage].badge,
                    )}
                  >
                    {incident.flowStage}
                  </Badge>
                </div>
                <IncidentFlowBar stage={incident.flowStage} />
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  {incident.category ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">
                      {incident.category}
                    </span>
                  ) : null}
                  {incident.severity ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold">
                      {incident.severity}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={() => setReportOpen(true)}
        className="fixed bottom-5 right-4 z-50 flex h-14 min-w-[14rem] items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-bold text-white shadow-xl shadow-primary/30 transition-transform active:scale-95 sm:right-6"
        aria-label="Reportar incidencia"
      >
        <Plus className="size-6" />
        Reportar incidencia
      </button>

      <ReportIncidentQuickModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        projects={data.projects}
        defaultProjectId={data.primaryProjectId}
        defaultClientRuc={data.primaryClientRuc}
      />
    </div>
  );
}
