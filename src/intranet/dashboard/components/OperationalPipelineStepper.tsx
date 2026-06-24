import { cn } from "@/shared/lib/utils";
import type { OperationalPipelineStatus } from "../interfaces/project-assistant-dashboard.types";

const STAGES: {
  status: OperationalPipelineStatus;
  label: string;
  color: string;
}[] = [
  { status: "Pendiente", label: "Pendiente", color: "bg-amber-500" },
  { status: "Cotizado", label: "Cotizado", color: "bg-sky-500" },
  { status: "Aprobado", label: "Aprobado", color: "bg-emerald-500" },
  { status: "En Ejecución", label: "En Ejecución", color: "bg-violet-500" },
];

interface OperationalPipelineStepperProps {
  counts: Record<OperationalPipelineStatus, number>;
  className?: string;
}

export function OperationalPipelineStepper({
  counts,
  className,
}: OperationalPipelineStepperProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-slate-50/80 p-4",
        className,
      )}
    >
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 md:text-left">
        Etapas por cantidad
      </p>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {STAGES.map((stage, index) => (
          <div key={stage.status} className="flex flex-1 items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm",
                  stage.color,
                )}
              >
                {counts[stage.status]}
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                {stage.label}
              </span>
            </div>
            {index < STAGES.length - 1 ? (
              <div className="hidden h-px flex-1 bg-gradient-to-r from-slate-300 to-slate-200 md:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
