import type { FC } from "react";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export const DonutChart: FC<{
  segments: DonutSegment[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}> = ({ segments, size = 160, centerLabel, centerValue }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={14}
          className="text-muted/30"
        />
        {segments.map((seg) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const el = (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={14}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue && (
            <span className="text-2xl font-bold text-foreground">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const FunnelChart: FC<{
  stages: { label: string; value: number; color: string }[];
  formatValue?: (value: number) => string;
}> = ({ stages, formatValue }) => {
  const max = Math.max(...stages.map((s) => s.value), 1);
  const format = formatValue ?? ((value: number) => String(value));

  return (
    <div className="space-y-2">
      {stages.map((stage, i) => {
        const widthPct = Math.max(20, (stage.value / max) * 100);
        return (
          <div key={stage.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs font-semibold text-muted-foreground">
              {stage.label}
            </span>
            <div className="flex-1">
              <div
                className="relative flex h-9 items-center rounded-lg px-3 text-xs font-bold text-white shadow-sm transition-all duration-500"
                style={{
                  width: `${widthPct}%`,
                  background: `linear-gradient(90deg, ${stage.color}, ${stage.color}cc)`,
                  marginLeft: `${i * 4}%`,
                }}
              >
                {format(stage.value)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const GaugeChart: FC<{
  value: number;
  max?: number;
  label: string;
  thresholds?: { warn: number; critical: number };
}> = ({ value, max = 100, label, thresholds = { warn: 7, critical: 10 } }) => {
  const pct = Math.min((value / max) * 100, 100);
  const angle = (pct / 100) * 180;
  const color =
    value >= thresholds.critical
      ? "#ef4444"
      : value >= thresholds.warn
        ? "#f59e0b"
        : "#22c55e";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-48 overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 h-24 w-48 -translate-x-1/2 rounded-t-full border-[14px] border-muted/30 border-b-0"
        />
        <div
          className="absolute bottom-0 left-1/2 h-24 w-48 origin-bottom transition-transform duration-700"
          style={{
            transform: `translateX(-50%) rotate(${angle - 180}deg)`,
            clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
            background: color,
            opacity: 0.85,
            width: "12px",
            height: "96px",
            left: "50%",
            marginLeft: "-6px",
          }}
        />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <p className="text-3xl font-bold" style={{ color }}>
            {value}%
          </p>
        </div>
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex gap-3 text-[10px]">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500" /> OK
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Alerta
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Crítico
        </span>
      </div>
    </div>
  );
};

export const MermaBarChart: FC<{
  rows: { projectName: string; mermaPercent: number; isCritical: boolean }[];
}> = ({ rows }) => {
  if (rows.length === 0) {
    return (
      <p className="py-6 text-center text-sm italic text-muted-foreground">
        Sin datos de merma por proyecto.
      </p>
    );
  }

  const max = Math.max(...rows.map((r) => r.mermaPercent), 10);

  return (
    <div className="space-y-2.5">
      {rows.map((row) => (
        <div key={row.projectName} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-semibold">{row.projectName}</span>
            <span
              className={`shrink-0 font-bold ${row.isCritical ? "text-red-600 animate-pulse" : "text-muted-foreground"}`}
            >
              {row.mermaPercent}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted/50">
            <div
              className={`h-full rounded-full transition-all duration-700 ${row.isCritical ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-amber-400 to-orange-500"}`}
              style={{ width: `${Math.max((row.mermaPercent / max) * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const MarginBar: FC<{
  budgeted: number;
  actual: number;
}> = ({ budgeted, actual }) => {
  const max = Math.max(budgeted, actual, 1);
  const budgetPct = (budgeted / max) * 100;
  const actualPct = (actual / max) * 100;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-emerald-700">Presupuesto estimado</span>
          <span className="font-mono">S/ {budgeted.toLocaleString("es-PE")}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
            style={{ width: `${budgetPct}%` }}
          />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-violet-700">Costo real ejecutado</span>
          <span className="font-mono">S/ {actual.toLocaleString("es-PE")}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
            style={{ width: `${actualPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};
