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
import { format } from "date-fns";
import { QuotationServiceStoreProvider } from "../../hooks/stores/quotation.services.store.provider";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type QuotationDetailFormCardProps = {
  quotation: DesiredQuotationData;
};

const estadoVariant: Record<string, "secondary" | "default" | "destructive"> = {
  pendiente: "secondary",
  aprobado: "default",
  rechazado: "destructive",
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
    <QuotationServiceStoreProvider initialServices={quotation.services}>
      <QuotationProductStoreProvider initialProducts={quotation.inventory}>
        <QuotationPickupStoreProvider initialData={quotation.pickupService}>
          <QuotationExchangeRateProvider
            initialData={{
              rate: quotation.quotationRate,
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
                  <div className="flex flex-row gap-4">
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-medium text-muted-foreground">
                        Cantidad de Fases
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {quotation.phases.quantity}
                      </p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-medium text-muted-foreground">
                        Duración por Fase
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {quotation.phases.duration} día(s)
                      </p>
                    </div>
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
                    items={[]}
                    readOnly={true}
                    onUpdateUnitPrice={undefined}
                    onUpdateDueDate={undefined}
                    onUpdateSchedule={undefined}
                    onUpdateStartDate={undefined}
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
                description="Datos del servicio de recojo incluido en la cotización."
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
              {/* Summary */}
              <SummaryCard />
            </div>
          </QuotationExchangeRateProvider>
        </QuotationPickupStoreProvider>
      </QuotationProductStoreProvider>
    </QuotationServiceStoreProvider>
  );
}
