import { type FC, type PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/utils";
import { useQuotationTruckStore } from "../../hooks/stores/quotation.truck.store.provider";
import { useQuotationReferenceStore } from "../../hooks/stores/quotation.reference.store.provider";
import { useQuotationPickupStore } from "../../hooks/stores/quotation.pickup.store.provider";

interface VisualizeTriggerProps {
  baseTriggerClass: string;
}

export const VisualizeTrigger: FC<
  PropsWithChildren<VisualizeTriggerProps>
> = ({ children, baseTriggerClass }) => {
  const trucks = useQuotationTruckStore((s) => s.selectedTrucks);
  const quotationName = useQuotationReferenceStore((s) => s.name);
  const phases = useQuotationReferenceStore((s) => s.phases);
  const pickupAddress = useQuotationPickupStore((s) => s.pickupAddress);

  const hasName = quotationName.trim().length > 0;
  const hasPhases = phases.items.length > 0;
  const hasAddress = pickupAddress.trim().length > 0;
  const hasTruck = trucks.length > 0;
  const isDisabled = !hasTruck || !hasPhases || !hasName || !hasAddress;

  const getDisabledReasons = () => {
    const reasons: string[] = [];

    if (!hasTruck) reasons.push("Debe seleccionar al menos un camión");
    if (!hasPhases) reasons.push("Debe definir al menos una fase");
    if (!hasName) reasons.push("Debe definir un nombre para la cotización");
    if (!hasAddress) reasons.push("Debe definir una dirección de envio");

    return reasons;
  };

  const disabledMessage = getDisabledReasons().join("\n");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="block min-w-full">
          <TabsTrigger
            value="visualize"
            className={cn(
              baseTriggerClass,
              "w-full",
              isDisabled && "pointer-events-none opacity-50",
            )}
          >
            {children}
          </TabsTrigger>
        </div>
      </TooltipTrigger>

      {isDisabled && (
        <TooltipContent>
          <p className="whitespace-pre-line">{disabledMessage}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};
