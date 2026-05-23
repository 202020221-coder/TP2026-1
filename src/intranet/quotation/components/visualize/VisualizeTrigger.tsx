import { type FC, type PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/utils";
import { useQuotationProductStore } from "../../hooks/stores/quotation.products.store.provider";
import { useQuotationTruckStore } from "../../hooks/stores/quotation.truck.store.provider";
import { useQuotationReferenceStore } from "../../hooks/stores/quotation.reference.store.provider";
import { useQuotationPickupStore } from "../../hooks/stores/quotation.pickup.store.provider";
import { useQuotationExchangeRate } from "../../hooks/stores/quotation.exchange.rate.store.provider";

interface VisualizeTriggerProps {
  baseTriggerClass: string;
}

export const VisualizeTrigger: FC<
  PropsWithChildren<VisualizeTriggerProps>
> = ({ children, baseTriggerClass }) => {
  const truck = useQuotationTruckStore((s) => s.selectedTruck);
  const inventory = useQuotationProductStore((s) => s.items);
  const quotationName = useQuotationReferenceStore((s) => s.name);
  const pickupAddress = useQuotationPickupStore((s) => s.pickupAddress);
  const rate = useQuotationExchangeRate((s) => s.rate);

  const hasInventory = Object.keys(inventory).length > 0;
  const hasName = quotationName.trim().length > 0;
  const hasAddress = pickupAddress.trim().length > 0;
  const hasRate = !!rate && rate.buyingRate > 0 && rate.sellingRate > 0;
  const isDisabled = !truck || !hasInventory || !hasName || !hasAddress || !hasRate;

  const getDisabledReasons = () => {
    const reasons: string[] = [];

    if (!truck) reasons.push("Debe seleccionar un camión");
    if (!hasInventory)
      reasons.push("Debe agregar al menos un item al inventario");
    if (!hasName) reasons.push("Debe definir un nombre para la cotización");
    if (!hasAddress)
      reasons.push("Debe definir una dirección de recojo");
    if (!hasRate)
      reasons.push("Debe esperar a que se cargue la tasa de cambio");

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
