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
import { BriefcaseBusiness, CalendarDays } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { DonutChart } from "./DashboardCharts";
import type { ClientProjectProgress } from "../interfaces/client-dashboard.types";

const PHASE_STYLES = {
  completed: {
    dot: "bg-emerald-500",
    line: "bg-emerald-400",
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    label: "Completado",
  },
  in_progress: {
    dot: "bg-sky-500 ring-4 ring-sky-100",
    line: "bg-sky-300",
    badge: "border-sky-300 bg-sky-50 text-sky-700",
    label: "En proceso",
  },
  pending: {
    dot: "bg-slate-300",
    line: "bg-slate-200",
    badge: "border-slate-300 bg-slate-50 text-slate-600",
    label: "Pendiente",
  },
} as const;

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface ClientProjectProgressPanelProps {
  progress: ClientProjectProgress | null;
}

export function ClientProjectProgressPanel({
  progress,
}: ClientProjectProgressPanelProps) {
  if (!progress) {
    return (
      <Card className="border-0 bg-white/90 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Estado de Ejecución del Proyecto</CardTitle>
          <CardDescription>
            Aún no tienes un proyecto activo en ejecución.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <BriefcaseBusiness className="size-12 text-slate-300" />
          <p className="max-w-md text-sm text-muted-foreground">
            Cuando una cotización sea aprobada y el proyecto inicie, verás aquí
            el avance por fases y el próximo hito.
          </p>
          <Button asChild variant="outline">
            <Link to="/intranet/proyectos/">Ver mis proyectos</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const milestoneDate = formatDate(progress.nextMilestoneDate);

  return (
    <Card className="border-0 bg-white/90 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg">Estado de Ejecución del Proyecto</CardTitle>
            <CardDescription className="mt-1">
              {progress.projectName}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="w-fit border-sky-300 bg-sky-50 text-sky-700"
          >
            {progress.projectStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-center">
          <div className="space-y-4">
            {progress.phases.length > 0 ? (
              <div className="overflow-x-auto pb-2">
                <div className="flex min-w-[520px] items-start gap-0">
                  {progress.phases.map((phase, index) => {
                    const style = PHASE_STYLES[phase.status];
                    const isLast = index === progress.phases.length - 1;

                    return (
                      <div
                        key={phase.id}
                        className="flex min-w-[130px] flex-1 flex-col items-center"
                      >
                        <div className="flex w-full items-center">
                          <div className={cn("size-4 shrink-0 rounded-full", style.dot)} />
                          {!isLast ? (
                            <div
                              className={cn("mx-1 h-1 flex-1 rounded-full", style.line)}
                            />
                          ) : null}
                        </div>
                        <p className="mt-2 px-1 text-center text-xs font-semibold text-slate-700">
                          {phase.name}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn("mt-1.5 text-[10px]", style.badge)}
                        >
                          {style.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-muted-foreground">
                El detalle de fases se cargará cuando el equipo configure el
                cronograma del proyecto.
              </p>
            )}

            {progress.nextMilestone ? (
              <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-white px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Próximo hito / entregable
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {progress.nextMilestone}
                  {milestoneDate ? ` — ${milestoneDate}` : ""}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
            <DonutChart
              size={150}
              centerValue={`${progress.progressPercent}%`}
              centerLabel="Avance"
              segments={[
                {
                  label: "Completado",
                  value: progress.progressPercent,
                  color: "#10b981",
                },
                {
                  label: "Restante",
                  value: Math.max(0, 100 - progress.progressPercent),
                  color: "#e2e8f0",
                },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/intranet/proyectos/">
              <BriefcaseBusiness className="mr-1.5 size-4" />
              Ver proyecto completo
            </Link>
          </Button>
          {milestoneDate ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
              <CalendarDays className="size-3.5 text-slate-400" />
              Fecha estimada: {milestoneDate}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
