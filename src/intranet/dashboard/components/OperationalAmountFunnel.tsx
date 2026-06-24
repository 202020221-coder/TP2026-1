import type { FC } from "react";
import { cn } from "@/shared/lib/utils";

export type AmountFunnelStage = {
  label: string;
  value: number;
  color: string;
};

interface OperationalAmountFunnelProps {
  stages: AmountFunnelStage[];
  formatValue: (value: number) => string;
  className?: string;
}

export const OperationalAmountFunnel: FC<OperationalAmountFunnelProps> = ({
  stages,
  formatValue,
  className,
}) => {
  const max = Math.max(...stages.map((s) => s.value), 1);
  const total = stages.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        {stages.map((stage) => {
          const widthPct =
            stage.value > 0 ? Math.max(8, (stage.value / max) * 100) : 0;

          return (
            <div
              key={stage.label}
              className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-xs font-semibold leading-tight text-slate-600">
                    {stage.label}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-slate-800">
                  {formatValue(stage.value)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    background: `linear-gradient(90deg, ${stage.color}, ${stage.color}cc)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {total > 0 ? (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Total embudo
          </span>
          <span className="font-mono text-sm font-bold tabular-nums text-slate-800">
            {formatValue(total)}
          </span>
        </div>
      ) : null}
    </div>
  );
};
