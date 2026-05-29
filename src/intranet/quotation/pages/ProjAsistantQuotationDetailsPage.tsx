import { ClientCard } from "../components/reference/ClientCard";
import { QuotationReferenceStoreProvider } from "../hooks/stores/quotation.reference.store.provider";
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
  AlertCircle,
  ArrowLeft,
  SquareChartGantt,
} from "lucide-react";
import { type FC } from "react";
import { QuotationProductsTable } from "../components/prices/products/ProductsTable";
import { QuotationServicesTable } from "../components/prices/services/ServicesTable";
import { QuotationProductStoreProvider } from "../hooks/stores/quotation.products.store.provider";
import { QuotationPickupStoreProvider } from "../hooks/stores/quotation.pickup.store.provider";
import { QuotationExchangeRateProvider } from "../hooks/stores/quotation.exchange.rate.store.provider";
import { TruckInfoCard } from "../components/prices/truck/TruckInfoCard";
import { PickupCardView } from "../components/prices/delivery/PickupCardView";
import { SummaryCard } from "../components/prices/summary/SummaryCard";
import { ConditionCard } from "../components/conditions/ConditionCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useNavigate } from "react-router";
import { useViewQuotationPage } from "../hooks/useViewQuotationPage";
import { NegotiationChatFloating } from "../components/negotiation/NegotiationChatFloating";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { QuotationServiceStoreProvider } from "../hooks/stores/quotation.services.store.provider";

export function ProjectAssistantQuotationDetailsPage() {
  const navigate = useNavigate();
  const { quotationId, data, isPending, isError } = useViewQuotationPage();

  if (!quotationId) {
    throw new Error("Id de cotización no especificado");
  }

  if (isPending) {
    return <ViewQuotationPageSkeleton />;
  }

  if (isError || !data) {
    return <ViewQuotationPageError />;
  }

  const baseTriggerClass =
    "flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-accent-foreground";

  return (
    <>
      <div className="flex h-full flex-col p-6 min-h-0">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-1 rounded-full bg-primary" />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {data.name}
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/intranet/cotizaciones")}
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </Button>
        </div>

        <Tabs
          defaultValue="reference"
          className="w-full flex flex-col flex-1 min-h-0"
        >
          <QuotationReferenceStoreProvider initialName={data.name}>
            <QuotationServiceStoreProvider initialServices={data.services}>
              <QuotationProductStoreProvider initialProducts={data.inventory}>
                <QuotationPickupStoreProvider initialData={data.pickupService}>
                  <QuotationExchangeRateProvider
                    initialData={{
                      rate: data.quotationRate,
                    }}
                  >
                    <TabsList className="grid grid-cols-3 border bg-card rounded-lg overflow-hidden min-h-12 gap-x-2 mx-3">
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
                    </TabsList>
                    <ScrollArea className="mt-2 flex-1 min-h-0">
                      <div className="px-3 py-6">
                        <TabsContent value="reference" className="space-y-6">
                          <ClientCard client={data.client} />
                        </TabsContent>
                        <TabsContent value="prices" className="space-y-6">
                          <Card className="gap-4 border bg-card shadow-none">
                            <CardHeader className="pb-0">
                              <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
                                <SquareChartGantt className="text-primary" />
                                <span className="pb-0.5 font-[375] text-[18px]">
                                  Productos Cotizados
                                </span>
                              </CardTitle>
                              <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
                                Productos incluidos en la cotización.
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <QuotationProductsTable
                                items={data.inventory}
                                readOnly={true}
                                onUpdateQuantity={undefined}
                                onUpdateUnitPrice={undefined}
                                onUpdateIntention={undefined}
                                onUpdateRentedDays={undefined}
                                onDelete={undefined}
                              />
                            </CardContent>
                          </Card>
                          <Card className="gap-4 border bg-card shadow-none">
                            <CardHeader className="pb-0">
                              <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
                                <SquareChartGantt className="text-primary" />
                                <span className="pb-0.5 font-[375] text-[18px]">
                                  Servicios
                                </span>
                              </CardTitle>
                              <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
                                Servicios incluidos en la cotización.
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <QuotationServicesTable
                                items={data.services}
                                readOnly={true}
                                onUpdateUnitPrice={undefined}
                                onDelete={undefined}
                                onUpdateDueDate={undefined}
                                onUpdateSchedule={undefined}
                                onUpdateStartDate={undefined}
                              />
                            </CardContent>
                          </Card>
                          <TruckInfoCard trucks={data.trucks} />
                          <PickupCardView
                            pickupCost={data.pickupService.pickupCost}
                            pickupDate={data.pickupService.pickupDate}
                            pickupAddress={data.pickupService.pickupAddress}
                            readOnly={true}
                            onPickupDateChange={undefined}
                            onPickupCostChange={undefined}
                            onPickupAddressChange={undefined}
                          />
                          <SummaryCard />
                        </TabsContent>
                        <TabsContent value="conditions" className="space-y-6">
                          <ConditionCard
                            emissionDate={data.quotationConditions.emissionDate}
                            expirationDate={
                              data.quotationConditions.expirationDate
                            }
                            conditions={data.quotationConditions.conditions}
                            observaciones={
                              data.quotationConditions.observations
                            }
                            readOnly={true}
                            onEmissionChange={undefined}
                            onExpirationChange={undefined}
                            onConditionsChange={undefined}
                            onObservacionesChange={undefined}
                          />
                        </TabsContent>
                      </div>
                    </ScrollArea>
                  </QuotationExchangeRateProvider>
                </QuotationPickupStoreProvider>
              </QuotationProductStoreProvider>
            </QuotationServiceStoreProvider>
          </QuotationReferenceStoreProvider>
        </Tabs>
      </div>
      <NegotiationChatFloating
        quotationId={Number(quotationId)}
        quotationEstado={data.status}
        contactName={data.client.companyName}
        contactRole={RolesRecord.client}
      />
    </>
  );
}

const ViewQuotationPageSkeleton: FC = () => (
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

const ViewQuotationPageError: FC = () => (
  <div className="flex h-full flex-col items-center justify-center p-6 gap-4">
    <AlertCircle className="h-12 w-12 text-destructive" />
    <h2 className="text-xl font-semibold text-foreground">
      Error al cargar la cotización
    </h2>
    <p className="text-muted-foreground text-sm text-center max-w-md">
      No se pudieron obtener los datos de la cotización. Intenta recargar la
      página o verifica que el ID sea correcto.
    </p>
    <Button variant="outline" onClick={() => window.location.reload()}>
      Reintentar
    </Button>
  </div>
);

export default ProjectAssistantQuotationDetailsPage;
