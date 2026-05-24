import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  SquareChartGantt,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { QuotationProductsTable } from "../prices/products/ProductsTable";
import { QuotationProductStoreProvider } from "../../hooks/stores/quotation.products.store.provider";
import { QuotationPickupStoreProvider } from "../../hooks/stores/quotation.pickup.store.provider";
import { QuotationExchangeRateProvider } from "../../hooks/stores/quotation.exchange.rate.store.provider";
import { TruckInfoCard } from "../prices/truck/TruckInfoCard";
import { PickupCardView } from "../prices/delivery/PickupCardView";
import { SummaryCard } from "../prices/summary/SummaryCard";
import type { ClientQuotationDetailsData } from "../../api/quotation.api";
import { format } from "date-fns";

type QuotationDetailFormCardProps = {
  quotation: ClientQuotationDetailsData;
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
            <PickupCardView
              pickupCost={quotation.costoRecojo.costo}
              pickupDate={quotation.costoRecojo.fechaRecojo}
              pickupAddress={quotation.costoRecojo.direccionRecojo}
              description="Datos del servicio de recojo incluido en la cotización."
              readOnly={true}
              onPickupDateChange={undefined}
              onPickupCostChange={undefined}
              onPickupAddressChange={undefined}
            />

            {/* Conditions (dates only for client) */}
            <ConditionsDatesCard
              fechaEmision={quotation.condiciones.fechaEmision}
              fechaVigencia={quotation.condiciones.fechaVigencia}
            />
            {/* Summary */}
            <SummaryCard />
          </div>
        </QuotationExchangeRateProvider>
      </QuotationPickupStoreProvider>
    </QuotationProductStoreProvider>
  );
}
