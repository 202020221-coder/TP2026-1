import type { FC } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { IncidentWorkflowStates } from "../../enum/quotation-state.record";
import type { IncidentState } from "../../interfaces/incident";

// Maps existing incident states to workflow positions for display
const stateToWorkflowIndex: Record<string, number> = {
  "Sin enviar": 0,
  "Enviado": 1,
  "En revisión": 2,
  "Cerrado": 4,
};

interface IncidentWorkflowStatusProps {
  currentState: IncidentState;
}

export const IncidentWorkflowStatus: FC<IncidentWorkflowStatusProps> = ({
  currentState,
}) => {
  const activeIndex = stateToWorkflowIndex[currentState] ?? 0;

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Estado actual
      </span>
      {/* Horizontal stepper */}
      <div className="flex items-center gap-0">
        {IncidentWorkflowStates.map((state, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isPending = idx > activeIndex;

          return (
            <div key={state} className="flex items-center">
              {/* Step node */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isActive
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="text-white" />
                  ) : (
                    <Circle
                      size={14}
                      className={isActive ? "text-primary" : "text-gray-300"}
                    />
                  )}
                </div>
                <span
                  className={`text-[9px] font-medium text-center max-w-[60px] leading-tight hidden sm:block ${
                    isCompleted
                      ? "text-primary"
                      : isActive
                      ? "text-primary font-semibold"
                      : isPending
                      ? "text-gray-400"
                      : ""
                  }`}
                >
                  {state}
                </span>
              </div>

              {/* Connector line (not after last item) */}
              {idx < IncidentWorkflowStates.length - 1 && (
                <div
                  className={`h-0.5 w-8 sm:w-10 mx-0.5 transition-all ${
                    idx < activeIndex ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Active label for mobile */}
      <span className="text-xs font-semibold text-primary sm:hidden">
        {currentState}
      </span>
    </div>
  );
};
