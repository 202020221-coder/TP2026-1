import { ClientCard } from "../components/reference/ClientCard";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { FileText, DollarSign, ClipboardList, Eye } from "lucide-react";
import { useSearchParams } from "react-router";
import { CreateQuotationPickupSection } from "../components/prices/delivery/CreateQuotationPickupSection";
import type { FC, PropsWithChildren } from "react";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { CreateQuotationProductsSection } from "../components/prices/products/CreateQuotationProductsSection";
import {
  QuotationProductStoreProvider,
  useQuotationProductStore,
} from "../hooks/stores/quotation.products.store.provider";
import {
  QuotationTruckStoreProvider,
  useQuotationTruckStore,
} from "../hooks/stores/quotation.truck.store.provider";
import { CreateQuotationTruckSelector } from "../components/prices/truck/CreateQuotationTruckSelector";
import { QuotationPickupStoreProvider } from "../hooks/stores/quotation.pickup.store.provider";
import { QuotationExchangeRateProvider } from "../hooks/stores/quotation.exchange.rate.store.provider";
import { CreateQuotationSummaryCard } from "../components/prices/summary/CreateQuotationSummaryCard";
import { CreateQuotationConditionCard } from "../components/conditions/CreateQuotationConditionCard";
import { QuotationConditionStoreProvider } from "../hooks/stores/quotation.conditions.store.provider";
import { CreateQuotationVisualizeSection } from "../components/visualize/CreateQuotationVisualizeSection";

export function CreateQuotationPage() {
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
        <QuotationConditionStoreProvider>
          <QuotationExchangeRateProvider>
            <QuotationTruckStoreProvider>
              <QuotationProductStoreProvider>
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
                    <ClientCard
                      client={{
                        DNI_O_RUC: "12345678",
                        nombre_comercial: "Edison",
                        razon_social: "Edisonso SAC",
                      }}
                    />
                  </TabsContent>
                  <QuotationPickupStoreProvider>
                    <TabsContent value="prices" className="space-y-6 pt-1">
                      <CreateQuotationProductsSection
                        orderId={Number(orderId)}
                      />
                      <CreateQuotationTruckSelector />
                      <CreateQuotationPickupSection orderId={Number(orderId)} />
                      <CreateQuotationSummaryCard />
                    </TabsContent>
                    <TabsContent value="conditions">
                      <CreateQuotationConditionCard />
                    </TabsContent>
                    <TabsContent value="visualize">
                      <CreateQuotationVisualizeSection />
                    </TabsContent>
                  </QuotationPickupStoreProvider>
                </ScrollArea>
              </QuotationProductStoreProvider>
            </QuotationTruckStoreProvider>
          </QuotationExchangeRateProvider>
        </QuotationConditionStoreProvider>
      </Tabs>
    </div>
  );
}

const VisualizeTrigger: FC<PropsWithChildren<{ baseTriggerClass: string }>> = ({
  children,
  baseTriggerClass,
}) => {
  const truck = useQuotationTruckStore((s) => s.selectedTruck);
  const inventory = useQuotationProductStore((s) => s.items);

  const hasInventory = Object.keys(inventory).length > 0;
  const isDisabled = !truck || !hasInventory;

  const getDisabledReasons = () => {
    const reasons: string[] = [];

    if (!truck) reasons.push("Debe seleccionar un camión");
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

export default CreateQuotationPage;
