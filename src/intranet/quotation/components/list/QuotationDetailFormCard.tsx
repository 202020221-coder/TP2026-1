import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  SquareChartGantt,
  MapPin,
  ClipboardList,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { QuotationProductsTable } from "../prices/products/ProductsTable";
import { QuotationProductStoreProvider } from "../../hooks/stores/quotation.products.store.provider";
import { QuotationPickupStoreProvider } from "../../hooks/stores/quotation.pickup.store.provider";
import { QuotationExchangeRateProvider } from "../../hooks/stores/quotation.exchange.rate.store.provider";
import { TruckInfoCard } from "../prices/truck/TruckInfoCard";
import { PickupCardView } from "../prices/delivery/PickupCardView";
import { ConditionCard } from "../conditions/ConditionCard";
import { SummaryCard } from "../prices/summary/SummaryCard";
import type { ClientQuotationDetailsData } from "../../api/quotation.api";

type QuotationDetailFormCardProps = {
  quotation: ClientQuotationDetailsData;
};

const estadoVariant: Record<string, "secondary" | "default" | "destructive"> = {
  pendiente: "secondary",
  aprobado: "default",
  rechazado: "destructive",
};

export function QuotationDetailFormCard({
  quotation,
}: QuotationDetailFormCardProps) {
  return (
    <QuotationProductStoreProvider initialProducts={quotation.productos}>
      <QuotationPickupStoreProvider
        initialData={{
          pickupAddress: quotation.costoRecojo.direccionRecojo,
          pickupCost: quotation.costoRecojo.costo,
          pickupDate: quotation.costoRecojo.fechaRecojo,
        }}
      >
        <QuotationExchangeRateProvider
          initialData={{
            rate: {
              buyingRate: quotation.tasaCambio.tasaCompra,
              sellingRate: quotation.tasaCambio.tasaVenta,
            },
          }}
        >
          <div className="space-y-6">
            {/* Title & Status */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {quotation.nombre}
              </h2>
              <Badge
                variant={estadoVariant[quotation.estado] ?? "secondary"}
                className="capitalize"
              >
                {quotation.estado}
              </Badge>
            </div>

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
                  items={quotation.productos}
                  readOnly={true}
                  onUpdateQuantity={undefined}
                  onUpdateUnitPrice={undefined}
                  onUpdateIntention={undefined}
                  onUpdateRentedDays={undefined}
                  onDelete={undefined}
                />
              </CardContent>
            </Card>

            {/* Truck */}
            <TruckInfoCard truck={quotation.camionEspecificado} />

            {/* Pickup */}
            <Card className="border bg-card shadow-none">
              <CardHeader className="pb-0">
                <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
                  <MapPin className="text-primary" />
                  <span className="pb-0.5 font-[375] text-[18px]">
                    Recojo
                  </span>
                </CardTitle>
                <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
                  Datos del servicio de recojo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PickupCardView
                  pickupCost={quotation.costoRecojo.costo}
                  pickupDate={quotation.costoRecojo.fechaRecojo}
                  pickupAddress={quotation.costoRecojo.direccionRecojo}
                  readOnly={true}
                  onPickupDateChange={undefined}
                  onPickupCostChange={undefined}
                  onPickupAddressChange={undefined}
                />
              </CardContent>
            </Card>

            {/* Conditions */}
            <Card className="border bg-card shadow-none">
              <CardHeader className="pb-0">
                <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
                  <ClipboardList className="text-primary" />
                  <span className="pb-0.5 font-[375] text-[18px]">
                    Condiciones
                  </span>
                </CardTitle>
                <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
                  Condiciones y vigencia de la cotización.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConditionCard
                  emissionDate={quotation.condiciones.fechaEmision}
                  expirationDate={quotation.condiciones.fechaVigencia}
                  conditions={quotation.condiciones.condiciones}
                  observaciones={quotation.condiciones.observaciones}
                  readOnly={true}
                  onEmissionChange={undefined}
                  onExpirationChange={undefined}
                  onConditionsChange={undefined}
                  onObservacionesChange={undefined}
                />
              </CardContent>
            </Card>

            {/* Summary */}
            <SummaryCard />
          </div>
        </QuotationExchangeRateProvider>
      </QuotationPickupStoreProvider>
    </QuotationProductStoreProvider>
  );
}
