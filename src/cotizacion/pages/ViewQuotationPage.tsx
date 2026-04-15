import { ReferenceSection } from "../components/ReferenceSection";

import { ScrollArea } from "@/shared/components/ui/scroll-area";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { FileText, DollarSign, ClipboardList, Eye } from "lucide-react";

import { useSearchParams } from "react-router";
import { InventoryTable } from "../components/precios/productos/InventoryTable";
import { ConditionSection } from "../components/condiciones/ConditionSection";
import { TruckSelector } from "../components/precios/camiones/TruckSelector";
import { TruckDriverSelector } from "../components/precios/camiones/TruckDriverSelector";
import { PickupSection } from "../components/precios/entrega/PickupSection";
import { SummaryCard } from "../components/precios/resumen/SummarySection";
import { useTruck } from "../hooks/stores/orderTruckStore";
import { VisualizeSection } from "../components/visualizacion/VisualizeSection";
import type { FC, PropsWithChildren } from "react";
import { useOrderInventoryStore } from "../hooks/stores/orderInventoryStore";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

export function ViewQuotationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    throw new Error("Id de la solicitud no especificada");
  }

  const baseTriggerClass =
    "flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="flex h-full flex-col bg-background px-6 py-4">
      <h1 className="mb-4 text-2xl font-semibold text-foreground">
        Elaborar Cotización - Solicitud #{orderId}
      </h1>

      <Tabs defaultValue="reference" className="w-full">
        <TabsList
          className="
            grid w-full grid-cols-4
            border
            bg-background
            rounded-lg
            overflow-hidden
            min-h-12
            gap-x-2
          "
        >
          <TabsTrigger value="reference" className={baseTriggerClass}>
            <FileText className="w-4 h-4" />
            Datos de Referencia
          </TabsTrigger>

          <TabsTrigger value="prices" className={baseTriggerClass}>
            <DollarSign className="w-4 h-4" />
            Precios
          </TabsTrigger>

          <TabsTrigger value="conditions" className={baseTriggerClass}>
            <ClipboardList className="w-4 h-4" />
            Condiciones
          </TabsTrigger>

          <VisualizeTrigger baseTriggerClass={baseTriggerClass}>
            <Eye className="w-4 h-4" />
            Visualización
          </VisualizeTrigger>
        </TabsList>

        <ScrollArea className="mt-2 h-[calc(100vh-180px)] rounded-sm border bg-background p-4">
          <TabsContent value="reference">
            <ReferenceSection orderId={Number(orderId)} />
          </TabsContent>
          <TabsContent value="prices" className="space-y-6 pt-1">
            <InventoryTable orderId={Number(orderId)} />
            <TruckSelector />
            <TruckDriverSelector />
            <PickupSection orderId={Number(orderId)} />
            <SummaryCard />
          </TabsContent>
          <TabsContent value="conditions">
            <ConditionSection />
          </TabsContent>
          <TabsContent value="visualize">
            <VisualizeSection />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

const VisualizeTrigger: FC<PropsWithChildren<{ baseTriggerClass: string }>> = ({
  children,
  baseTriggerClass,
}) => {
  const truck = useTruck((s) => s.selectedTruck);
  const truckDriver = useTruck((s) => s.selectedTruckDriver);
  const inventory = useOrderInventoryStore((s) => s.items);

  const hasInventory = Object.keys(inventory).length > 0;
  const isDisabled = !truck || !truckDriver || !hasInventory;

  const getDisabledReasons = () => {
    const reasons: string[] = [];

    if (!truck) reasons.push("Debe seleccionar un camión");
    if (!truckDriver) reasons.push("Debe seleccionar un conductor");
    if (!hasInventory)
      reasons.push("Debe agregar al menos un item al inventario");

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

export default ViewQuotationPage;
