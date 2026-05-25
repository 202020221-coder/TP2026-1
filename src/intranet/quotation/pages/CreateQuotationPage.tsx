import { ClientCard } from "../components/reference/ClientCard";
import { ReferenceNameCard } from "../components/reference/ReferenceNameCard";
import {
  QuotationReferenceStoreProvider,
} from "../hooks/stores/quotation.reference.store.provider";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  FileText,
  DollarSign,
  ClipboardList,
  Eye,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { CreateQuotationPickupSection } from "../components/prices/delivery/CreateQuotationPickupSection";
import { CreateQuotationProductsSection } from "../components/prices/products/CreateQuotationProductsSection";
import { QuotationProductStoreProvider } from "../hooks/stores/quotation.products.store.provider";
import { QuotationTruckStoreProvider } from "../hooks/stores/quotation.truck.store.provider";
import { CreateQuotationTruckSelector } from "../components/prices/truck/CreateQuotationTruckSelector";
import { QuotationPickupStoreProvider } from "../hooks/stores/quotation.pickup.store.provider";
import { QuotationExchangeRateProvider } from "../hooks/stores/quotation.exchange.rate.store.provider";
import { CreateQuotationSummaryCard } from "../components/prices/summary/CreateQuotationSummaryCard";
import { CreateQuotationConditionCard } from "../components/conditions/CreateQuotationConditionCard";
import { QuotationConditionStoreProvider } from "../hooks/stores/quotation.conditions.store.provider";
import { CreateQuotationVisualizeSection } from "../components/visualize/CreateQuotationVisualizeSection";
import { VisualizeTrigger } from "../components/visualize/VisualizeTrigger";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useCreateQuotationPage } from "../hooks/useCreateQuotationPage";
import { type FC } from "react";
import { useNavigate } from "react-router";

export function CreateQuotationPage() {
  const navigate = useNavigate();
  const { orderId, orderData, exchangeRate, isPending, isError } =
    useCreateQuotationPage();

  if (!orderId) {
    throw new Error("Id de la solicitud no especificada");
  }

  if (isPending) {
    return <CreateQuotationPageSkeleton />;
  }

  if (isError || !orderData) {
    return <CreateQuotationPageError />;
  }

  const orderDataSafe = orderData;

  const baseTriggerClass =
    "flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="flex h-full flex-col p-6 min-h-0">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1 rounded-full bg-primary" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Elaborar Cotización - Solicitud #{orderId}
          </h1>
        </div>
        <Button variant="outline" onClick={() => navigate("/intranet/solicitudes")}>
          <ArrowLeft className="h-4 w-4" />
          Regresar
        </Button>
      </div>

      <Tabs
        defaultValue="reference"
        className="w-full flex flex-col flex-1 min-h-0"
      >
        <QuotationConditionStoreProvider>
          <QuotationExchangeRateProvider
            initialData={exchangeRate ? { rate: exchangeRate } : undefined}
          >
            <QuotationReferenceStoreProvider
              initialName={orderDataSafe.Cliente_Nombre}
            >
              <QuotationTruckStoreProvider>
                <QuotationProductStoreProvider
                  initialProducts={orderDataSafe.inventario}
                >
                  <QuotationPickupStoreProvider
                    initialData={{ pickupAddress: orderDataSafe.ubicacion }}
                  >
                    <TabsList className="grid grid-cols-4 border bg-card rounded-lg overflow-hidden min-h-12 gap-x-2 mx-3">
                      <TabsTrigger
                        value="reference"
                        className={baseTriggerClass}
                      >
                        <FileText className="w-4 h-4" />
                        Datos de Referencia
                      </TabsTrigger>
                      <TabsTrigger value="prices" className={baseTriggerClass}>
                        <DollarSign className="w-4 h-4" />
                        Precios
                      </TabsTrigger>
                      <TabsTrigger
                        value="conditions"
                        className={baseTriggerClass}
                      >
                        <ClipboardList className="w-4 h-4" />
                        Condiciones
                      </TabsTrigger>
                      <VisualizeTrigger baseTriggerClass={baseTriggerClass}>
                        <Eye className="w-4 h-4" />
                        Visualización
                      </VisualizeTrigger>
                    </TabsList>
                    <ScrollArea className="mt-2 flex-1 min-h-0">
                      <div className="px-3 py-6">
                        <TabsContent value="reference" className="space-y-6">
                          <ClientCard
                            client={{
                              DNI_O_RUC: orderDataSafe.Id_Cliente,
                              nombre_comercial: orderDataSafe.Cliente_Nombre,
                              razon_social: orderDataSafe.Razon_Social,
                            }}
                          />
                          <ReferenceNameCard />
                        </TabsContent>
                        <TabsContent value="prices" className="space-y-6">
                          <CreateQuotationProductsSection />
                          <CreateQuotationTruckSelector />
                          <CreateQuotationPickupSection />
                          <CreateQuotationSummaryCard />
                        </TabsContent>
                        <TabsContent value="conditions">
                          <CreateQuotationConditionCard />
                        </TabsContent>
                        <TabsContent value="visualize">
                          <CreateQuotationVisualizeSection
                            detailedOrder={orderDataSafe}
                          />
                        </TabsContent>
                      </div>
                    </ScrollArea>
                  </QuotationPickupStoreProvider>
                </QuotationProductStoreProvider>
              </QuotationTruckStoreProvider>
            </QuotationReferenceStoreProvider>
          </QuotationExchangeRateProvider>
        </QuotationConditionStoreProvider>
      </Tabs>
    </div>
  );
}

const CreateQuotationPageSkeleton: FC = () => (
  <div className="flex h-full flex-col p-6 min-h-0">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-7 w-1 rounded-full" />
      <Skeleton className="h-7 w-72" />
    </div>
    <div className="space-y-4 mx-3">
      <Skeleton className="h-12 w-full rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg sm:col-span-2" />
      </div>
    </div>
  </div>
);

const CreateQuotationPageError: FC = () => (
  <div className="flex h-full flex-col items-center justify-center p-6 gap-4">
    <AlertCircle className="h-12 w-12 text-destructive" />
    <h2 className="text-xl font-semibold text-foreground">
      Error al cargar la solicitud
    </h2>
    <p className="text-muted-foreground text-sm text-center max-w-md">
      No se pudieron obtener los datos de la solicitud. Intenta recargar la
      página o verifica que el ID sea correcto.
    </p>
    <Button variant="outline" onClick={() => window.location.reload()}>
      Reintentar
    </Button>
  </div>
);

export default CreateQuotationPage;
