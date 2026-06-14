import type { FC } from "react";
import { cn } from "@/shared/lib/utils";

export type IncidentTab =
  | "incidencias"
  | "objetos"
  | "personal"
  | "ocurrencias";

interface IncidentMenuTabsProps {
  active: IncidentTab;
  onChange: (tab: IncidentTab) => void;
  hasSelection: boolean;
}

const TABS: { key: IncidentTab; label: string }[] = [
  { key: "incidencias", label: "Incidencias" },
  { key: "objetos", label: "Objetos" },
  { key: "personal", label: "Personal" },
  { key: "ocurrencias", label: "Ocurrencias" },
];

export const IncidentMenuTabs: FC<IncidentMenuTabsProps> = ({
  active,
  onChange,
  hasSelection,
}) => {
  return (
    <div className="flex gap-1 border-b border-border pb-px">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const disabled = tab.key !== "incidencias" && !hasSelection;
        return (
          <button
            key={tab.key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-md transition-colors",
              isActive
                ? "bg-background text-foreground border border-border border-b-background -mb-px"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              disabled && "opacity-40 cursor-not-allowed",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
