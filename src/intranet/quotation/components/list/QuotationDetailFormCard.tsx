import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { SquareChartGantt, ClipboardList, Layers } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { QuotationProductsTable } from "../prices/products/ProductsTable";
import { QuotationServicesTable } from "../prices/services/ServicesTable";
import { QuotationProductStoreProvider } from "../../hooks/stores/quotation.products.store.provider";
import { QuotationPickupStoreProvider } from "../../hooks/stores/quotation.pickup.store.provider";
import { QuotationExchangeRateProvider } from "../../hooks/stores/quotation.exchange.rate.store.provider";
import { TruckInfoCard } from "../prices/truck/TruckInfoCard";
import { PickupCardView } from "../prices/delivery/PickupCardView";
import { SummaryCard } from "../prices/summary/SummaryCard";
import { QuotationPaymentTermsCard } from "../conditions/QuotationPaymentTermsCard";
import { format } from "date-fns";
import { QuotationServiceStoreProvider } from "../../hooks/stores/quotation.services.store.provider";
import { QuotationReferenceStoreProvider } from "../../hooks/stores/quotation.reference.store.provider";
import { toStoreExchangeRate } from "../../api/exchange-rate.api";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type QuotationDetailFormCardProps = {
  quotation: DesiredQuotationData;
};

const estadoVariant: Record<string, "secondary" | "default" | "destructive"> = {
  pendiente: "secondary",
  aprobado: "default",
  rechazado: "destructive",
  no_aprobado: "secondary",
  incidencia_pagada: "default",
};

const ConditionsDatesCard = ({
  fechaEmision,
  fechaVigencia,
}: {
  fechaEmision: string;
  fechaVigencia: string;
}) => (
  <Card className="border bg-card shadow-none">
    <CardHeader className="pb-0">
      <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
        <ClipboardList className="text-primary" />
        <span className="pb-0.5 font-[375] text-[18px]">Condiciones</span>
      </CardTitle>
      <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
        Vigencia de la cotización.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            Fecha de Emisión
          </p>
          <p className="text-sm font-semibold text-foreground">
            {format(new Date(fechaEmision), "dd/MM/yyyy")}
          </p>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            Fecha de Expiración
          </p>
          <p className="text-sm font-semibold text-foreground">
            {format(new Date(fechaVigencia), "dd/MM/yyyy")}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function QuotationDetailFormCard({
  quotation,
}: QuotationDetailFormCardProps) {
  return (
    <QuotationReferenceStoreProvider
      name={quotation.name}
      phases={quotation.phases}
      projectStartDate={quotation.projectStartDate}
    >
      <QuotationServiceStoreProvider initialServices={quotation.services}>
        <QuotationProductStoreProvider initialProducts={quotation.inventory}>
          <QuotationPickupStoreProvider initialData={quotation.pickupService}>
            <QuotationExchangeRateProvider
              initialData={{
                rate: toStoreExchangeRate(quotation.quotationRate),
              }}
            >
            <div className="space-y-6">
              {/* Title & Status */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {quotation.name}
                </h2>
                <Badge
                  variant={estadoVariant[quotation.status] ?? "secondary"}
                  className="capitalize"
                >
                  {quotation.status}
                </Badge>
              </div>

              {/* Phases */}
              <Card className="border bg-card shadow-none">
                <CardHeader className="pb-0">
                  <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
                    <Layers className="text-primary" />
                    <span className="pb-0.5 font-[375] text-[18px]">
                      Fases de la Cotización
                    </span>
                  </CardTitle>
                  <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
                    Información de fases.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span>{quotation.phases.items.length} fase(s)</span>
                    <span>
                      {quotation.phases.items.reduce((a, p) => a + p.duration, 0)} días total
                    </span>
                    <span>
                      {quotation.phases.items.reduce((a, p) => a + p.activities.length, 0)} actividad(es)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {quotation.phases.items.map((phase, idx) => (
                      <div key={phase.id} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-foreground">
                            {idx + 1}. {phase.name}
                          </p>
                          <Badge variant="secondary" className="text-xs font-normal">
                            {phase.duration} día(s)
                          </Badge>
                        </div>
                        {phase.description && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {phase.description}
                          </p>
                        )}
                        {phase.activities.length > 0 && (
                          <div className="space-y-0.5 mt-2">
                            {phase.activities.map((act, actIdx) => (
                              <p key={act.id} className="text-xs text-muted-foreground pl-2">
                                {actIdx + 1}. {act.name}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card className="border bg-card shadow-none">
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
                    items={quotation.inventory}
                    readOnly={true}
                    onUpdateQuantity={undefined}
                    onUpdateUnitPrice={undefined}
                    onUpdateIntention={undefined}
                    onUpdateRentedDays={undefined}
                    onDelete={undefined}
                  />
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="border bg-card shadow-none">
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
                    items={quotation.services}
                    readOnly={true}
                    onUpdateUnitPrice={undefined}
                    onUpdateSchedule={undefined}
                    onDelete={undefined}
                  />
                </CardContent>
              </Card>

              {/* Truck */}
              <TruckInfoCard trucks={quotation.trucks} />

              {/* Pickup */}
              <PickupCardView
                pickupCost={quotation.pickupService.pickupCost}
                pickupDate={quotation.pickupService.pickupDate}
                pickupAddress={quotation.pickupService.pickupAddress}
                description="Datos del servicio de envio incluido en la cotización."
                readOnly={true}
                onPickupDateChange={undefined}
                onPickupCostChange={undefined}
                onPickupAddressChange={undefined}
              />

              {/* Conditions (dates only for client) */}
              <ConditionsDatesCard
                fechaEmision={quotation.quotationConditions.emissionDate}
                fechaVigencia={quotation.quotationConditions.expirationDate}
              />
              <QuotationPaymentTermsCard
                plazosPago={quotation.quotationConditions.plazosPago}
                readOnly
              />
              {/* Summary */}
              <SummaryCard />
            </div>
            </QuotationExchangeRateProvider>
          </QuotationPickupStoreProvider>
        </QuotationProductStoreProvider>
      </QuotationServiceStoreProvider>
    </QuotationReferenceStoreProvider>
  );
}
